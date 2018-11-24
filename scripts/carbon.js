const request = require('request');
const _ = require('lodash');
const csv = require('csvtojson');
const fs = require('fs');

const distances = require('./distances');

const apikey = require('./apikey.js');

const KESKO_PRODUCT_API = 'https://kesko.azure-api.net/v1/search/products';

const headers = {
  'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': apikey
};

let main = [];

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

const parseProductInfo = info => {
  const response = {};

  response.ean = info.ean;

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

  response.sustainability = {};
  if (response.origin.id !== 'N/A' && response.origin.id !== 'EU') {
    response.sustainability.distance = distances[response.origin.id].toFixed(1);

    if (info.attributes.TX_YMPMER && info.attributes.TX_YMPMER.value) {
      response.sustainability.marks = Object.keys(
        info.attributes.TX_YMPMER.value
      ).length;
      response.sustainability.score =
        (1 / response.sustainability.marks) * response.sustainability.distance;
    } else {
      response.sustainability.marks = 0;
      response.sustainability.score = response.sustainability.distance;
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

  response.health.score = calculateHealthScore(response).toFixed(1);

  return response;
};

csv()
  .fromFile('./eans_from_500k_rows.csv')
  .then(data => {
    return Promise.all(
      _.chunk(data, 80).map((list, i) => {
        const body = JSON.stringify({
          filters: {
            ean: list.map(l => l.ean)
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
                console.log(error, `ean not found: ${d.ean}`);
                resolve();
              } else {
                const results = JSON.parse(body).results;
                console.log(results.length);
                main = main.concat(results.map(r => parseProductInfo(r)));
                resolve();
              }
            }
          );
        });
      })
    );
  })
  .then(res => {
    const jsonData = main.reduce(
      (acc, cur) =>
        Object.assign(acc, {
          [cur.ean]: {
            health: cur.health.score,
            sustainability: cur.sustainability.score
          }
        }),
      {}
    );

    return new Promise((resolve, reject) => {
      fs.writeFile('scores.json', JSON.stringify(jsonData), 'utf8', () => {
        resolve();
      });
    });
  });
