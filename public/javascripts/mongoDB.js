
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://joaoprata:<1234>@cluster0-ehxh7.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

//mongodb+srv://joaoprata:<password>@cluster0-ehxh7.mongodb.net/test?retryWrites=true&w=majority