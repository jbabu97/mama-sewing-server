const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();


const port = 5757;
// console.log(process.env.PASS); jbabu1997


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7dhhj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("mama-sewing").collection("addService");
  const collection = client.db("mama-sewing").collection("bookService");
    console.log('db connected');

    app.post('/addService', (req, res) => {
      const newService = req.body;
      serviceCollection.insertMany(newService)
      .then((result) => {
        console.log("inserted count", result);
        res.send(result.insertedCount > 0)
      });
    });

    app.get('/services', (req, res) => {
      serviceCollection.find()
      .toArray((err, services) => {
        res.send(services);
      });
    });

    app.get('/services/:serviceId', (req, res) => {
      serviceCollection.find({_id: ObjectId(req.params.serviceId)})
      .toArray((err, services) => {
        res.send(services[0]);
      });
    });





  // client.close();
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`This server is running at port:${port}`)
})

