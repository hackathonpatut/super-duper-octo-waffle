import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'
import request from 'request';
import _ from 'lodash';

require('dotenv').config();

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

const router = express.Router()

const staticFiles = express.static(path.join(__dirname, '../../client/build'))
app.use(staticFiles)

const KESKO_PRODUCT_API = 'https://kesko.azure-api.net/v1/search/products';
const KESKO_PRICE_API = '???';

const headers = {
  'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': process.env.API_KEY,
}

const getProductInfo = (ean) => {

  const body = JSON.stringify({
    filters: {
      ean: [String(ean)],
    }
  });

  return new Promise((resolve, reject) => {
    request(KESKO_PRODUCT_API, {
      url: KESKO_PRODUCT_API,
      method: 'POST',
      headers: headers,
      body,
    }, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        reject(error.message || 'Request failed!');
      }
      resolve(body);
    });
  });
}

const parseProductInfo = (info) => {
  const response = {};
  response.name = info.labelName.finnish || info.labelName.english,
  response.segment = {
    name: info.segment.finnish || info.segment.english,
    id: info.segment.id,
  }
  response.category = {
    name: info.category.finnish || info.category.english,
    id: info.category.id,
  }
  response.subcategory = {
    name: info.subcategory.finnish || info.category.english,
    id: info.subcategory.id,
  }

  if (info.attributes.WHERL) {
    response.origin = {
      id: info.attributes.WHERL.value.value || 'N/A',
      country: info.attributes.WHERL.value.explanation.finnish || 'N/A',
    }
  } else {
    response.origin = {
      id: 'N/A',
      country: 'N/A',
    }
  }

  return response;
}

router.get('/product/:ean',  asyncMiddleware(async (req, res) => {
  const ean = req.params.ean;
  if (!ean || ean.length !== 13) {
    return res.json({
      code: -1,
      message: `Invalid EAN supplied: ${ean}`
    });
  };
  const dataRaw = await getProductInfo(ean);
  const data = JSON.parse(dataRaw);

  if (data.totalHits === 0) {
    return res.json({
      code: -1,
      message: `EAN did not match a single product`,
    });
  }

  const parsed = parseProductInfo(data.results[0]);

  return res.json(parsed);
}));

app.use(router)

app.use('/*', staticFiles)

app.set('port', (process.env.PORT || 3001))
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})
