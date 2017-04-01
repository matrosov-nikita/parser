import * as mongodb from 'mongodb';
const mongoClient = mongodb.MongoClient;
const MONGODB_URL = 'mongodb://localhost:27017/ivanovofood';
const COLLECTION_NAME = "food";

class DBHelper {
	db: mongodb.Db;
	static connect() {
		return mongoClient
			.connect(MONGODB_URL)
			.then(db => new DBHelper(db));
	}

	constructor(database) {
		this.db = database;
	}

	getUpdatedItemId(item) {
		return item.value ?
			item.value._id :
			item.lastErrorObject.upserted;
	}

	updateItem(item) {
		return this.db.collection(COLLECTION_NAME).findOneAndUpdate(
			{ name: item.name },
			{ $set: item },
			{
				upsert: true,
				projection: { name: true },
				returnOriginal: true
			});
	}

	removeUnmodifiedItems(modified) {
		let query = {
			_id: {
				$nin: modified
			}
		}

		return this.db.collection(COLLECTION_NAME).remove(query);
	}

	closeConnection() {
		this.db.close();
	}
}

export default DBHelper;