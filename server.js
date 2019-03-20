const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbName = 'vouchers';
const uri = "mongodb+srv://user_01:user1234@cluster0-v4so5.azure.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
const bodyParser = require("body-parser");


const express = require('express')
const app = express()
const router = express.Router();



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", router);

router.post("/putData", (req, res) => {
	const data = req.body
	client.connect(err => {
		const db = client.db(dbName)
		console.log("Connected successfully to server");

		insertDocuments(db, () => {
			client.close();
		})
		return res.json({ success: true });
	});


  	const insertDocuments = function(db, callback) {
		const collection = db.collection('documents');
		collection.insertOne(data, function(err, result) {
			assert.equal(err, null);
			assert.equal(1, result.result.n);
			assert.equal(1, result.ops.length);
		});
	}
  
});


router.get('/getAllData', (req, res) => {
	client.connect(err => {
		const collection = client.db(dbName)
		// perform actions on the collection object
		console.log("Connected successfully to server");
		
		findDocuments(collection, () => {
		  client.close();
		})
	});

	const findDocuments = function(db, callback) {
		// Get the documents collection
		const collection = db.collection('documents');
		// Find some documents
		collection.find({}).toArray(function(err, docs) {
			assert.equal(err, null);
			return res.json(docs)
		});
	}
})

app.listen(3001, function () {
	console.log('server runnin at port 3001')
})