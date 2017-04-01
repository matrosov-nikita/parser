const mongoClient = require('mongodb').MongoClient;
import DBHelper from './helpers/db';
import Utils from './helpers/utils';
import Parser from './libs/Parser';

let dbHelper = null;

console.log('Connecting to a database...')
DBHelper.connect()
  .then(helper => {
    dbHelper = helper;
    console.log('\nConnected succesfully. Parsing pages...')

    let parser = new Parser();
    return parser.run();
  })
  .then(items => {
    console.log('\nPages succesfully parsed. Updating database...');
    items = Utils.flattenFirstLevel(items);

    let modifyActions = items.map(item => {
      return dbHelper.updateItem(item);
    });

    return Promise.all(modifyActions);
  })
  .then(updates => {
    console.log(`\n${updates.length} items has been updated. Cleaning old items...`);

    let updatedIds = updates.map(update => dbHelper.getUpdatedItemId(update));
    return dbHelper.removeUnmodifiedItems(updatedIds);
  })
  .then(() => {
    console.log('\nDatabase has been updated!')
    dbHelper.closeConnection();
  })
  .catch(console.error);