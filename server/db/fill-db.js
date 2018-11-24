import { Client } from 'pg';
import csv from 'csvtojson';
import _ from 'lodash';
require('dotenv').config();

const scores = require('../../../scripts/scores.json');

const calculateHealth = products =>
  products.reduce(
    (acc, cur) => (acc + scores[cur.EAN] ? scores[cur.EAN].health : 0),
    0
  ) / _.sumBy(products, 'Quantity');

const calculateSustainability = products =>
  products.reduce(
    (acc, cur) =>
      acc + scores[cur.EAN] && scores[cur.EAN].sustainability
        ? scores[cur.EAN].sustainability
        : 0,
    0
  ) / _.sumBy(products, 'Quantity');

const main = async () => {
  const client = new Client();
  await client.connect();

  const values = Object.keys(scores)
    .map(
      k =>
        `('${k}', ${scores[k].health || 0}, ${scores[k].sustainability || 0})`
    )
    .join(', ');

  await client.query(
    `INSERT INTO Products (ean, health, sustainability) VALUES ${values}`
  );

  const baskets = await csv({ delimiter: ';' }).fromFile(
    '/home/markus/projects/super-duper-octo-waffle/scripts/baskets_500k.csv'
  );
  const grouped = _.groupBy(baskets, 'Receipt');

  const basketValues = Object.keys(grouped)
    .map(
      receipt =>
        `('${receipt}', ${calculateHealth(
          grouped[receipt]
        )}, ${calculateSustainability(grouped[receipt])})`
    )
    .join(', ');

  await client.query(
    `INSERT INTO Baskets (id, health, sustainability) VALUES ${basketValues}`
  );

  await client.end();
};

main();
