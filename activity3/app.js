require('dotenv').config();
const sdk = require('node-appwrite');
const ID = sdk.ID;
const { recreateCollections } = require('./setup/collections');
const { createAttributes, waitForAttributesAvailable } = require('./setup/attributes');
const { insertAll } = require('./insert');
const { runQueries } = require('./queries');

const endpoint = process.env.APPWRITE_ENDPOINT;
const project = process.env.APPWRITE_PROJECT;
const apiKey = process.env.APPWRITE_KEY;
const databaseId = process.env.DATABASE_ID;

async function main(){
  const client = new sdk.Client().setEndpoint(endpoint).setProject(project).setKey(apiKey);
  const databases = new sdk.Databases(client);
  console.log('== Activity 3 starting ==');
  await recreateCollections(databases, databaseId);
  await createAttributes(databases, databaseId);
  await waitForAttributesAvailable(databases, databaseId, 'customers', ['customerID','lastName','firstName','contact','city','country']);
  await waitForAttributesAvailable(databases, databaseId, 'products', ['productID','productName']);
  await waitForAttributesAvailable(databases, databaseId, 'orders', ['orderID','dateOrdered','shippedDate','status','customerID','lineProductID','lineQuantityOrdered','linePriceEach']);
  await insertAll(databases, databaseId, ID);
  await runQueries(databases, databaseId);
  console.log('== Activity 3 done ==');
}
main().catch(e=>{console.error('Fatal:',e.message);process.exit(1);});
