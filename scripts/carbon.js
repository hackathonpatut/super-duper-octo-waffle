const request = require('request');
const _ = require('lodash');

const apikey = require('./apikey.js');

const KESKO_PRODUCT_API = 'https://kesko.azure-api.net/v1/search/products';

const headers = {
  'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': apikey
};

const body = JSON.stringify({});

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
      console.log(error);
    }

    const dada = JSON.parse(body);
    console.log(
      _.uniq(
        dada.results
          .map(d => d.subcategory)
          .filter(d => d)
          .map(d => d.finnish)
      ).sort()
    );
  }
);
