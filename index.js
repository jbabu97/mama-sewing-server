const express = require("express");
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require("express-fileupload");
require("dotenv").config();
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb', extended: true }));
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
  const bookingCollection = client.db("mama-sewing").collection("bookService");
  const statusCollection = client.db("mama-sewing").collection("status");

    app.post("/addAdmin", (req, res) => {
      const email = req.body;
      // console.log(email);
      adminCollection.insertOne(email)
      .then((result) => {
        res.send(result.insertedCount > 0);
        // console.log(result);
      });
    });

    // app.post("/isAdmin", (req, res) => {
    //   const email = req.body.email;
    //   // console.log(email);
    //   adminCollection.find({ email: email })
    //   .toArray((err, admins) => {
    //           res.send(admins.length > 0);
    //           // console.log(admins);
    //   });
    // });
    
    app.post("/addService", (req, res) => {
      const file = req.files.file;
      const newService = req.body;
      // const serviceCharge = req.body.serviceCharge;
      // console.log(newService, file);
      const newImg = file.data;
      const encImg = newImg.toString("base64");
  
      let image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, "base64"),
      };
      // console.log(image);
  
      serviceCollection.insertOne( {newService, image} )
      .then((result) => {
        res.send(result.insertedCount > 0);
        // console.log(result);
      });
  
    });

    app.post("/addBooking", (req, res) => {
      const newBooking = req.body;
      console.log(newBooking);
      bookingCollection.insertOne(newBooking)
      .then((result) => {
        res.send(result.insertedCount > 0);
        // console.log(result);
      });
    });

    app.get("/bookings", (req, res) => {
      bookingCollection.find({})
      .toArray((err, bookings) => {
        res.send(bookings);
        // console.log(bookings);
      });
    });
    
    app.get("/services", (req, res) => {
      serviceCollection.find({})
      .toArray((err, services) => {
        res.send(services);
        // console.log(services);
      });
    });

    app.get(`/serviceDetails/:serviceId`, (req, res) => {
      const serviceDetails = {_id: ObjectId(req.params.serviceId)}
      console.log(serviceDetails);
      serviceCollection.find(serviceDetails)
      .toArray((err, services) => {
        // console.log(services[0]);
        res.send(services[0]);
      })
    });


    app.delete('/deleteService/:serviceId', (req, res) => {
      const deleteService = {_id: ObjectId(req.params.serviceId)}
      console.log(deleteService);
      serviceCollection.deleteOne(deleteService)
      .then(result => {
          res.send(result.deletedCount > 0)
          // console.log(result);
      })
  })

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

    app.post("/status", (req, res) => {
      const status = req.body;
      console.log(status);
      statusCollection.insertOne(status)
      .then((result) => {
        // res.send(result.insertedCount > 0);
        console.log(result);
      });
    });


});







app.get("/", (req, res) => {
  res.send("Hello tailors!");
});

app.listen(port, () => {
  console.log(`This server is running at port: ${port};`);
});