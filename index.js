const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5005;

process.env.DB_PASSWORD;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wlf4d.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const brandsCollection = client.db("vehicaDB").collection("brands");

    // app.get("/api/products", (req, res) => {

    //     const db = client.db("your-database-name"); // Replace with your database name
    //     const collection = db.collection("products");

    //     collection.find().toArray((err, data) => {
    //       if (err) throw err;
    //       res.json(data);
    //       client.close();
    //     });
    //   });

    // app.post("/api/products", (req, res) => {
    //   const productData = req.body;

    //   console.log(productData);

    //   brandsCollection.insertOne(productData, (err, data) => {
    //     if (err) throw err;

    //     res.status(200).send("Product added");
    //   });
    // });
    // post single data endpoint
  app.post("/api/products", async (req, res) => {
    const productData = req.body;
    console.log("user", productData);
    const result = await brandsCollection.insertOne(productData);
    console.log(result);
    res.status(200).send(result);
   ;
  });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Crud is running...");
});

app.listen(port, () => {
  console.log(`Simple Crud is Running on port ${port}`);
});
