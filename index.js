const express = require("express");
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require("express-fileupload");
require("dotenv").config();
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("doctors"));
app.use(fileUpload());

const port = 4747;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7dhhj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const adminCollection = client.db("mama-sewing").collection("admin");
  const serviceCollection = client.db("mama-sewing").collection("addService");
  const reviewCollection = client.db("mama-sewing").collection("review");

    app.post("/addAdmin", (req, res) => {
      const email = req.body;
      console.log(email);
      adminCollection.insertOne(email)
      .then((result) => {
        res.send(result.insertedCount > 0);
        // console.log(result);
      });
    });
    
    app.post("/addService", (req, res) => {
      const file = req.files.file;
      const newService = req.body;
      // const serviceCharge = req.body.serviceCharge;
      console.log(newService, file);
      const newImg = file.data;
      const encImg = newImg.toString("base64");
  
      let image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, "base64"),
      };
      console.log(image);
  
      serviceCollection.insertOne( {newService, image} )
      .then((result) => {
        res.send(result.insertedCount > 0);
        // console.log(result);
      });
  
    });

    app.get("/services", (req, res) => {
      serviceCollection.find({})
      .toArray((err, services) => {
        res.send(services);
        // console.log(services);
      });
    });

    app.get('/services/:serviceId', (req, res) => {
      serviceCollection.find({_id: ObjectId(req.params.serviceId)})
      .toArray((err, services) => {
        res.send(services[0]);
        // console.log(services[0]);
      });
    });


    app.post("/addReview", (req, res) => {
      const review = req.body;
      console.log(review);
      reviewCollection.insertOne(review)
      .then((result) => {
        res.send(result.insertedCount > 0);
        // console.log(result);
      });
    });

    app.get("/reviews", (req, res) => {
      reviewCollection.find({})
      .toArray((err, reviews) => {
        res.send(reviews);
        // console.log(reviews);
      });
    });


});







app.get("/", (req, res) => {
  res.send("Hello tailors!");
});

app.listen(port, () => {
  console.log(`This server is running at port: ${port};`);
});