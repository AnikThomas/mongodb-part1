//We required mongodb node.js driver & imported in mongoClient
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert').strict;

const url = 'mongodb://localhost:27017/';
const dbname = 'nucampsite';

//We use mongoClient.connect method in order to make a connection to the mongodb server,
//the connect method callback gave to us a client object that we then used to access the new campsite database
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {

    assert.strictEqual(err, null);

    console.log('Connected correctly to server');

    const db = client.db(dbname);

    //then we deleted/drop the campsites collection from the database and recreated it
    db.dropCollection('campsites', (err, result) => {
        assert.strictEqual(err, null);
        console.log('Dropped Collection', result);

        const collection = db.collection('campsites');
        //inserting a new document into the campsites collection
        collection.insertOne({name: "Breadcrumb Trail Campground", description: "Test"},
        (err, result) => {
            assert.strictEqual(err, null);
            console.log('Insert Document:', result.ops);
            //Finally we use the collection.find method along with the two array method to be able to 
            //console log all the documents from the campsites collections
            collection.find().toArray((err, docs) => {
                assert.strictEqual(err, null);
                console.log('Found Documents:', docs);
                //then we close the client,we handle any errors using the node error callback convention
                //and we use the assert core module to stop the app if any errors occurred.
                client.close();
            });
        });
    });
});