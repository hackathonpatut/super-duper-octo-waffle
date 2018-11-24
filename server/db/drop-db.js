import { Client } from 'pg';
require('dotenv').config();

const main = async () => {
  const client = new Client();
  await client.connect();

  await client.query('DROP TABLE Products');

  const res = await client.query('DROP TABLE Baskets');
  await client.end();
};

main();
