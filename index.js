const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello")
})

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.qwt8kth.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const usersCollection = client.db('social').collection('users');
        const postCollection = client.db('social').collection('post');

        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = usersCollection.insertOne(users);
            res.send(result);
        })
        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = postCollection.insertOne(post);
            res.send(result);
        })


        // Edit userInfo

        app.put('/userinfo/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const info = req.body;
            const option = { upset: true }
            const updatInfo = {
                $set: {
                    name: info.name,
                    studied: info.studied,
                    location: info.location,
                }
            }
            const result = await usersCollection.updateOne(filter, updatInfo, option)
            res.send(result)
        })

        // Update like
        app.put('/like/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const info = req.body;
            const option = { upset: true }
            const updatInfo = {
                $set: {
                    like: info.Like,
                }
            }
            const result = await postCollection.updateOne(filter, updatInfo, option)
            res.send(result)
        })



        // get post by user specipic
        app.get('/getpost', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = postCollection.find(query);
            const posts = await cursor.toArray();
            res.send(posts)
        })

        app.get('/post', async (req, res) => {
            const post = await postCollection.find({}).sort({like:-1}).toArray();
            res.send(post)
        })

        app.get('/users/:email', async (req, res) => {
            const query = {};
            const users = usersCollection.find(query);
            const newusers = await users.toArray();
            const user = newusers.find(newuser => newuser.email === req.params.email)
            res.send(user);
        })


    }
    finally { }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`listening on ${port}`);
})
