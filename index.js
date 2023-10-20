const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    app.get("/api/products", async (req, res) => {
      const result = await brandsCollection.find().toArray();
      console.log(result);
      res.send(result);
    });
    // get group of product using brand name

    app.get("/api/products/:brandName", async (req, res) => {
      const brandName = req.params.brandName;
      console.log("brandName", brandName);
      const query = {
        brandName: brandName,
      };
      const result = await brandsCollection.find(query).toArray();
      console.log("result", result);
      res.send(result);
    });
    // get single product using id

    app.get("/api/singleProduct/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", id);
      const query = {
        _id: new ObjectId(id),
      };
      const result = await brandsCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    // update single user

    app.put("/api/products/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;

      const filter = {
        _id: new ObjectId(id),
      };
      const options = { upsert: true };
      const updatedData = {
        $set: {
          name: data.name,
          email: data.email,
          brandName: data.brandName,
          type: data.type,
          priceInDollars: data.priceInDollars,
          rating: data.rating,
          image: data.image,
        },
      };
      const result = await brandsCollection.updateOne(
        filter,
        updatedData,
        options
      );
      res.send(result);
    });

    // // get group of product using id

    // app.get("/api/products/:brandName", async (req, res) => {
    //   const brandName = req.params.brandName;
    //   console.log("brandName", brandName);
    //   const query = {
    //     brandName: brandName,
    //   };
    //   const result = await brandsCollection.find.toArray(query);
    //   console.log(result);
    //   res.send(result);
    // });

    // // get single data using id

    // app.get("/users/:id", async (req, res) => {
    //   const id = req.params.id;
    //   console.log("id", id);
    //   const query = {
    //     _id: new ObjectId(id),
    //   };
    //   const result = await userCollection.findOne(query);
    //   console.log(result);
    //   res.send(result);
    // });
    // post single data endpoint
    app.post("/api/products", async (req, res) => {
      const productData = req.body;
      console.log("user", productData);
      const result = await brandsCollection.insertOne(productData);
      console.log(result);
      res.status(200).send(result);
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
