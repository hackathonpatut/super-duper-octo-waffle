import { Client } from 'pg';
import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import request from 'request';
import _ from 'lodash';

import distances from './distances';
require('dotenv').config();

const client = new Client()

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const router = express.Router();

const staticFiles = express.static(path.join(__dirname, '../../client/build'));
app.use(staticFiles);

const KESKO_PRODUCT_API = 'https://kesko.azure-api.net/v1/search/products';
const KESKO_PRICE_API = `https://kesko.azure-api.net/products`;
const SHOP_CODE = 'C609';

// category / subcategory / segment
const MATCHING_LEVEL = 'subcategory';

const MIN_HEALTH = -10017;
const MAX_HEALTH = 88.1;
const MIN_SUSTAINABILITY = 0;
const MAX_SUSTAINABILITY = 16892;

const scaleHealth = value => (value - MIN_HEALTH) / (MAX_HEALTH - MIN_HEALTH);
const scaleSustainability = value =>
  1 - (value - MIN_SUSTAINABILITY) / (MAX_SUSTAINABILITY - MIN_SUSTAINABILITY);

const headers = {
  'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': process.env.API_KEY
};

const calculateHealthScore = o => {
  const weights = {
    energy: -0.1,
    sugar: -1,
    fat: -1,
    carbohydrates: -1,
    salt: -1,
    protein: 1
  };

  return Object.keys(o.health).reduce(
    (acc, cur) => acc + weights[cur] * o.health[cur],
    0
  );
};

const getProductInfo = ean => {
  const body = JSON.stringify({
    filters: {
      ean: [String(ean)]
    }
  });

  return new Promise((resolve, reject) => {
    request(
      KESKO_PRODUCT_API,
      {
        url: KESKO_PRODUCT_API,
        method: 'POST',
        headers: headers,
        body
      },
      function(error, response, body) {
        if (error || response.statusCode !== 200) {
          reject(error || 'Request failed!');
        }
        resolve(body);
      }
    );
  });
};

const getMatchingProducts = id => {
  const body = JSON.stringify({
    filters: {
      [MATCHING_LEVEL]: {
        id: id
      }
    }
  });

  return new Promise((resolve, reject) => {
    request(
      KESKO_PRODUCT_API,
      {
        method: 'POST',
        headers,
        body
      },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          reject(response.statusMessage);
        }
        resolve(body);
      }
    );
  });
};

const getProductPrice = ean =>
  new Promise((resolve, reject) => {
    request(
      `${KESKO_PRICE_API}/${SHOP_CODE}/${ean}`,
      {
        method: 'GET',
        headers
      },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          resolve(JSON.stringify({ pricingUnit: 'N/A', totalPrice: -1 }));
        }
        resolve(body);
      }
    );
  });

const parseProductPrice = info => ({
  unit: info.pricingUnit,
  value: info.totalPrice
});

const parseProductInfo = async (info, ean) => {
  const response = {};
  (response.name = info.labelName.finnish || info.labelName.english),
    (response.segment = {
      name: info.segment.finnish || info.segment.english,
      id: info.segment.id
    });
  response.category = {
    name: info.category.finnish || info.category.english,
    id: info.category.id
  };
  response.subcategory = {
    name: info.subcategory.finnish || info.category.english,
    id: info.subcategory.id
  };

  response.popularity = info.popularity;

  if (info.attributes.WHERL) {
    response.origin = {
      id: info.attributes.WHERL.value.value || 'N/A',
      country: info.attributes.WHERL.value.explanation.finnish || 'N/A'
    };
  } else {
    response.origin = {
      id: 'N/A',
      country: 'N/A'
    };
  }

  response.ean = info.ean;

  if (info.pictureUrls && info.pictureUrls[0] && info.pictureUrls[0].original) {
    response.image = `${info.pictureUrls[0].original}?h=300&fit=clip`;
  } else {
    response.image = null;
  }

  response.sustainability = {};
  if (response.origin.id !== 'N/A') {
    response.sustainability.distance = distances[response.origin.id].toFixed(1);

    if (info.attributes.TX_YMPMER && info.attributes.TX_YMPMER.value) {
      response.sustainability.marks = Object.keys(
        info.attributes.TX_YMPMER.value
      ).length;
      response.sustainability.score = scaleSustainability(
        (1 / response.sustainability.marks) * response.sustainability.distance
      );
    } else {
      response.sustainability.marks = 0;
      response.sustainability.score = scaleSustainability(
        response.sustainability.distance
      );
    }
  }

  response.health = {};

  if (info.attributes.ENERKC) {
    response.health.energy = info.attributes.ENERKC.value.value;
  }

  if (info.attributes.SOKERI) {
    response.health.sugar = info.attributes.SOKERI.value.value;
  }

  if (info.attributes.SUOLPI) {
    response.health.salt = info.attributes.SUOLPI.value.value;
  }

  if (info.attributes.RASVAA) {
    response.health.fat = info.attributes.RASVAA.value.value;
  }

  if (info.attributes.PROTEG) {
    response.health.protein = info.attributes.PROTEG.value.value;
  }

  if (info.attributes.HIHYDR) {
    response.health.carbohydrates = info.attributes.HIHYDR.value.value;
  }

  response.health.score = scaleHealth(calculateHealthScore(response));

  const priceDataRaw = await getProductPrice(ean);
  const priceData = parseProductPrice(JSON.parse(priceDataRaw));

  response.price = priceData;

  return response;
};

router.get(
  '/product/:ean',
  asyncMiddleware(async (req, res) => {
    const ean = req.params.ean;
    if (!ean || ean.length !== 13) {
      return res.json({
        code: -1,
        message: `Invalid EAN supplied: ${ean}`
      });
    }
    const dataRaw = await getProductInfo(ean);
    const data = JSON.parse(dataRaw);

    if (data.totalHits === 0) {
      return res.json({
        code: -1,
        message: `EAN did not match a single product`
      });
    }

    const parsed = await parseProductInfo(data.results[0], ean);

    if (parsed.segment.id) {
      const matchingRaw = await getMatchingProducts(parsed[MATCHING_LEVEL].id);
      const matching = JSON.parse(matchingRaw);

      if (matching.totalHits > 0) {
        await Promise.all(
          matching.results.map(async m => await parseProductInfo(m, m.ean))
        )
          .then(infos => {
            parsed.matching = {
              sustainability: _.orderBy(
                infos.filter(
                  i =>
                    i.price.value !== -1 &&
                    i.origin.id !== 'N/A' &&
                    i.ean !== parsed.ean
                ),
                ['sustainability.score', 'popularity'],
                ['desc', 'desc']
              ).slice(0, 5),

              health: _.orderBy(
                infos.filter(i => i.price.value !== -1 && i.ean !== parsed.ean),
                ['health.score', 'popularity'],
                ['desc', 'desc']
              ).slice(0, 5)
            };
          })
          .catch(err => {
            console.log(err);
          });
      }
    }

    return res.json(parsed);
  })
);

const getScore = async function(ean) {
  const res = await client.query(
  `SELECT health, sustainability FROM products WHERE ean = '` + ean + `';`);
  // If ean is not found, return median value
  if (res.rowCount == 0) {
    return {
      'health': 19.7,
      'sustainability': 433
    }
  } else {
    const scores =  _.map(res.rows, o => {
      return ({
        'health': scaleHealth(parseFloat(o.health)),
        'sustainability': scaleSustainability(parseFloat(o.sustainability))
      });
    });
    return scores[0]
  }
}


app.post('/cart-comparison', (req, res) => {
  client.connect();
  const j={'name':'binchen'};
  const k = JSON.stringify(j); // '{"name":"binchen"}'
  console.log(req.body);
  const eans = req.body.eans;

  getScore(eans[0]).then(result => {
    console.log("mooikka moi")
    console.log(result)
  })
  console.log(typeof(eans));




  client.query('SELECT * FROM Baskets limit 100;', (error, result) => {
    //console.log(error ? error.stack : result) // Hello World!
    var healths = _.map(result.rows, o => {
      return scaleHealth(parseFloat(o.health))
    });
    healths = healths.sort()
    //console.log(healths);
    client.end();
  })

  const dummy_res = {
    'health': 0.75,
    'sustainability': 0.6
  }

  res.send(JSON.stringify(dummy_res))

  //res.send(JSON.stringify(req.body));
});

/*
{
  sustainability-ranking: 0.25
  sustainability-score: 0.25
  heath-ranki
}
*/
router.get('/cart-comparison', (err, res) => {
  client.connect();
  client.query('SELECT COUNT(*) FROM Products;', (error, result) => {
    console.log(error ? error.stack : result) // Hello World!
    client.end()
  })

/*
  await client.query(
    'SELECT COUNT(*) FROM Products;'
  );
  */
/*
  client.query('SELECT COUNT(*) FROM Products;', (err, res) => {

  console.log(err ? err.stack : res.rows[0].message) // Hello World!
})*/
  res.send('res');
});


/*
const res = await client.query(
  'SELECT COUNT(*) FROM Products;''
);


client.connect()
client.query('COUNT (*) FROM Products', (err, res) => {
  console.log(err ? err.stack : res) // Hello World!
  client.end()
})
*/
app.use(router);

app.use('/*', staticFiles);

app.set('port', process.env.PORT || 3001);
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`);
});
