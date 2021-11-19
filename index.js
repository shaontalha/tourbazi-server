const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
var bodyParser = require('body-parser');

app.use(bodyParser());
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000

app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.heqw3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tourbazi');
        const sevicesCollection = database.collection('services');
        const bookingsCollection = database.collection('bookings');



        app.post("/addaNewService", async (req, res) => {
            const result = await sevicesCollection.insertOne(req.body);
            res.send(result);
        })

        app.get("/allServices", async (req, res) => {
            const result = await sevicesCollection.find({}).toArray();
            res.send(result);
        })

        app.get("/allServices/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await sevicesCollection.findOne(query);
            res.json(result);
        })

        app.post("/confirmOrder", async (req, res) => {
            const result = await bookingsCollection.insertOne(req.body);
            res.send(result)
        })

        app.get("/myOrders/:email", async (req, res) => {
            const result = await bookingsCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })

        app.delete("/deleteOrder/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.send(result)
        })

    }
    finally {
        // await client.close();

    }

}


run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Tourbazi!')
})

app.listen(port, () => {
    console.log(`Listening at ${port}`)
})