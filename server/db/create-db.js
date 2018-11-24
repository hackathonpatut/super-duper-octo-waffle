import { Client } from 'pg';
require('dotenv').config();

const main = async () => {
  const client = new Client();
  await client.connect();

  await client.query(
    'CREATE TABLE IF NOT EXISTS Products (ean VARCHAR(16), health NUMERIC, sustainability NUMERIC, PRIMARY KEY (ean))'
  );

  const res = await client.query(
    'CREATE TABLE IF NOT EXISTS Baskets (id VARCHAR(16), health NUMERIC, sustainability NUMERIC, PRIMARY KEY (id))'
  );
  await client.end();
};

main();
