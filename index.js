const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
const app = express()
require('dotenv').config()

const corsOptions = {
    origin: ['http://localhost:5173', 'https://jwt-b9a11.web.app'],
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.usv0l7z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Collection
        const jobCollection = client.db('JobInformations').collection('jobCategory')
        const addedJobsCollection = client.db('JobInformations').collection('addedJobs')
        // data of tabs
        app.get('/jobs', async (req, res) => {
            const result = await jobCollection.find().toArray()
            res.send(result)
        })

        // Get Added Jobs Data
        app.get('/addedjobs', async (req, res) => {
            const result = await addedJobsCollection.find().toArray()
            res.send(result)
        })

        // data posting from frontend
        app.post('/addedjobs', async (req, res) => {
            const allJobs = req.body;
            console.log(allJobs);
            const result = await addedJobsCollection.insertOne(allJobs);
            console.log(result);
            res.send(result)
        });

        //  Delete a single data
        app.delete('/addedjobs/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await addedJobsCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally { }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
