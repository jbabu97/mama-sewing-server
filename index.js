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

// process.env.PORT || 
const port = process.env.PORT || 4747;
// console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7dhhj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const adminCollection = client.db("mama-sewing").collection("admin");
  const serviceCollection = client.db("mama-sewing").collection("addService");
  const reviewCollection = client.db("mama-sewing").collection("review");
  const bookingCollection = client.db("mama-sewing").collection("bookService");

    app.post("/addAdmin", (req, res) => {
      const email = req.body;
      adminCollection.insertOne(email)
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
    });

    app.post("/bookingByCustomer", (req, res) => {
      const email = req.body.email;
      adminCollection.find({ email: email })
      .toArray((err, admins) => {
              if(admins.length > 0) {
                bookingCollection.find({})
                .toArray((err, results) => {
                  res.send(results);
                });
              }
              else{
                bookingCollection.find({email: email})
                .toArray((err, results) => {
                  res.send(results);
                });
              }
      });
    });
    
    app.post("/isAdmin", (req, res) => {
      const email = req.body.email;
      adminCollection.find({ email: email })
      .toArray((err, admins) => {
        res.send(admins.length > 0);
});
    });
    
    app.post("/addService", (req, res) => {
      const file = req.files.file;
      const newService = req.body;
      const newImg = file.data;
      const encImg = newImg.toString("base64");
  
      let image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, "base64"),
      };
        
      serviceCollection.insertOne( {newService, image} )
      .then((result) => {
        res.send(result.insertedCount > 0);
        console.log(result);
      });
  
    });

    app.get("/services", (req, res) => {
      serviceCollection.find({})
      .toArray((err, services) => {
        res.send(services);
        
      });
    });

    app.get(`/serviceDetails/:serviceId`, (req, res) => {
      const serviceDetails = {_id: ObjectId(req.params.serviceId)}
      
      serviceCollection.find(serviceDetails)
      .toArray((err, services) => {
        res.send(services[0]);
      })
    });

    app.post("/addBooking", (req, res) => {
      const newBooking = req.body;
      
      bookingCollection.insertOne(newBooking)
      .then((result) => {
        res.send(result.insertedCount > 0);
        
      });
    });

    app.get("/bookings", (req, res) => {
      bookingCollection.find({})
      .toArray((err, bookings) => {
        res.send(bookings);
        
      });
    });
    
    app.patch('/statusUpdate/:bookingId', (req, res) => {
      const update = ObjectId(req.params.bookingId)
      // console.log('id', update);
      const newStatus = req.body;
      // console.log('status', newStatus);
      bookingCollection.findOneAndUpdate(
        {_id: update},
        {$set: {status: newStatus}}
        )
      .then(result => {
        console.log(result);
          res.send(result.ok > 0)
          
      })
  })
    

    app.delete('/deleteService/:serviceId', (req, res) => {
      const deleteService = {_id: ObjectId(req.params.serviceId)}
      
      serviceCollection.deleteOne(deleteService)
      .then(result => {
          res.send(result.deletedCount > 0)
          
      })
  })

    app.post("/addReview", (req, res) => {
      const review = req.body;
      
      reviewCollection.insertOne(review)
      .then((result) => {
        res.send(result.insertedCount > 0);
        
      });
    });

    app.get("/reviews", (req, res) => {
      reviewCollection.find({})
      .toArray((err, reviews) => {
        res.send(reviews);
        
      });
    });

});



app.get("/", (req, res) => {
  res.send("Hello tailors!");
});

app.listen(port, () => {
  console.log(`This server is running at port: ${port};`);
});