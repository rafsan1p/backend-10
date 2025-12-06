const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bq2avso.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        //await client.connect();

        const database = client.db('petService');
        const petServices = database.collection('services');
        const orderCollections = database.collection('orders');

        //post or save data to database
        app.post('/services', async (req, res) => {
            const data = req.body;
            const date = new Date();
            data.createdAt = date;
            console.log(data);

            const result = await petServices.insertOne(data);
            res.send(result);

        });

        //get services from database
        app.get('/services', async (req, res) => {
            const {category} = req.query;
            const query = {}
            if(category){
                query.category = category;
            }
            const result = await petServices.find(query).toArray();
            res.send(result);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params;
            console.log(id);

            const query = { _id: new ObjectId(id) };
            const result = await petServices.findOne(query);
            res.send(result);
        });

        app.get('/my-services', async(req, res) => {
            const {email} = req.query;
            const query = {email: email};
            const result = await petServices.find(query).toArray();
            res.send(result);
            
        });

        app.put('/update/:id', async(req, res) => {
            const data = req.body;
            const id = req.params;
            const query = { _id: new ObjectId(id) };
            
            const updateServices = {
                $set: data           
            }
            const result = await petServices.updateOne(query, updateServices);
            res.send(result);

        });

        app.delete('/delete/:id', async(req, res) => {
            const id = req.params;
            const query = { _id: new ObjectId(id) };
            const result = await petServices.deleteOne(query);
            res.send(result);
        });
            
        app.post('/orders', async(req, res) => {
            const data = req.body;
            console.log(data);
            const result = await orderCollections.insertOne(data);
            res.status(201).send(result);
        });

        app.get('/orders', async (req, res) => {
            try {
                const { email } = req.query;
                const query = email ? { buyerEmail: email } : {};
                const result = await orderCollections.find(query).toArray();
                res.status(201).send(result);
            } catch (error) {
                res.status(500).send({ error: error.message });
            }
        });

        //npm i mongodb express cors dotenv

        //await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from backend-10')
});

app.listen(port, () => {
    console.log(`Backend-10 is listening on port ${port}`);
});