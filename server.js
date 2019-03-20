const express = require('express'),
	MongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID,
	assert = require('assert'),
	bodyParser = require('body-parser')

const app = express(),
	router = express.Router(),
	uri = "mongodb+srv://user_01:user1234@cluster0-v4so5.azure.mongodb.net/test?retryWrites=true",
	client = new MongoClient(uri, { useNewUrlParser: true }),
	DATABASE = 'vouchers',
	VOUCHERS = 'documents'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// === CRUD METHODS ================================================

// GET ALL VOUCHERS FROM DATABASE
router.get('/getAll', function(req, res) {
	client.connect(err => {
		const collection = client.db(DATABASE).collection(VOUCHERS);
		findDocuments(collection, {}, function(docs) {
			console.log(docs)
			return res.json(docs)
			client.close()
		})
	})
})

// GET ONE VOUCHER FROM DATABASE
router.get('/getOne', function(req, res) {
	const voucherID = req.body.id
	client.connect(err => {
		const collection = client.db(DATABASE).collection(VOUCHERS);
		findDocuments(collection, {'_id': ObjectID(voucherID)}, function(docs) {
			console.log(docs)
			return res.json(docs)
			client.close()
		})
	})
})

// INSERT VOUCHER IN DATABASE
router.post('/post', function(req, res) {
	const voucher = req.body
	client.connect(err => {
		const collection = client.db(DATABASE).collection(VOUCHERS);
		insertDocuments(collection, voucher, function(doc) {
			return res.json(doc)
			client.close()
		})
	})
})

// UPDATE VOUCHER IN DATABASE
router.put('/put', function(req, res) {
	const data = req.body
	client.connect(err => {
		const collection = client.db(DATABASE).collection(VOUCHERS);
		updateDocument(collection, data, function(result) {
			return res.json(result)  // VERIFICAR SE É ISSO MESMO.
			client.close()
		})
	})
})

// DELETE A VOUCHER FROM DATABASE
router.delete('/delete', function(req, res) {
	const voucher = req.body
	client.connect(err => {
		const collection = client.db(DATABASE).collection(VOUCHERS);
		removeDocument(collection, voucher._id, function(result) {
			return res.json(result)  // VERIFICAR SE É ISSO MESMO.
			client.close()
		})
	})
})

// DISABLE ONE VOUCHER
router.put('/disable', function(req, res) {
	const data = req.body
	client.connect(err => {
		const collection = client.db(DATABASE).collection(VOUCHERS);
		disableDocument(collection, data, function(result) {
			return res.json({success: true})
			client.close()
		})
	})
})



// === MONGODB HELPER FUNCTIONS ===========================================

const findDocuments = function(collection, filter, callback) {
	collection.find(filter).toArray(function(err, docs) {
		assert.equal(err, null)
	    	callback(docs);
	})
}

const insertDocuments = function(collection, voucher, callback) {
	collection.insertOne( voucher, function(err, success) {
		assert.equal(err, null)
		assert.equal(1, success.result.n)
		assert.equal(1, success.ops.length)
		console.log("Voucher created successfully.");
		callback(success.ops)
	})
}

const updateDocument = function(collection, data, callback) {
	collection.updateOne({'_id': ObjectID(data.id)}, { $set: data.voucher }, function (err, success) {
		assert.equal(err, null)
		assert.equal(1, success.result.n)
    	callback(success.result)
	})
}

const disableDocument = function(collection, data, callback) {
	collection.updateOne({'_id': ObjectID(data.id)}, { $set: { 'disabled': true, 'disabledBy': data.user }}, function (err, success) {
		assert.equal(err, null)
		assert.equal(1, success.result.n)
    	callback(success)
	})
}

const removeDocument = function(collection, id, callback) {
	collection.deleteOne({'_id': ObjectID(id)}, function(err, success) {
		assert.equal(err, null)
		assert.equal(1, success.result.n)
		callback(result)
	})
}

// carrega o módulo do router no app
app.use('/api', router);

app.listen(3001, function () {
  console.log('Listening on port 3001!');
});