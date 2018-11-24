const request = require('request');
const _ = require('lodash');
const csv = require('csvtojson');

const apikey = require('./apikey.js');

const KESKO_PRODUCT_API = 'https://kesko.azure-api.net/v1/search/products';

const headers = {
  'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': apikey
};

const body = JSON.stringify({});

csv()
  .fromFile('./unique_EANs_in_receipt_data.csv')
  .then(data => {
    data.forEach(d => {
      const body = JSON.stringify({
        filters: {
          ean: d.ean
        }
      });
      setTimeout(() => {
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
            }
          }
        );
      }, Math.random() * 600000);
    });
  });
