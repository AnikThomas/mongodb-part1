//We required mongodb node.js driver & imported in mongoClient
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert').strict;
const dboper = require('./operations');

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

        dboper.insertDocument(db, {name: "Breadcrumb Trail Campground", description: "Test"},
            'campsites', result=>{
                console.log('Insert Document:', result.ops);

                dboper.findDocuments(db, 'campsites',docs =>{
                    console.log('Found Documents: ', docs);

                    dboper.updateDocument(db, { name: "Breadcrumb Trail Campground"},
                    {description: "Updated Test Description"}, 'campsites', result =>{
                        console.log('Updated Document Count: ', result.result.nModified);
                    
                        dboper.findDocuments(db, 'campsites', docs => {
                            console.log('Found Documents:', docs);
                            
                            dboper.removeDocument(db, { name: "Breadcrumb Trail Campground" },
                                'campsites', result => {
                                    console.log('Deleted Document Count:', result.deletedCount); 

                                    client.close();
                                }
                            );
                        });
                    }
                );
            });
        });
    });
});