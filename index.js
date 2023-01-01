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
        const commentCollection = client.db('social').collection('comments');

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

        app.post('/comments', async (req, res) => {
            const comment = req.body;
            const result = commentCollection.insertOne(comment);
            res.send(result);
        })

        app.get('/comments/:id', async (req, res) => {
            const comment = commentCollection.find({});
            const comments = await comment.toArray();
            const findComment = comments.filter(newcomment => newcomment.postId === req.params.id);
            res.send(findComment);

        })
        // app.get('/comments', async (req, res) => {
        //     const id = req.query.id;
        //     const comments = await commentCollection.find({ postId: id }).toArray();
        //     const posts = await postCollection.find({ id: id }).toArray();
        //     res.send({ comments: comments, posts: posts });
        // });
        // app.get('/comments',async(req,res)=>{
        //     const comments = await commentCollection.find({}).toArray();
        //     const post = await postCollection.find({}).toArray();
        //     const getComments = comments.filter(comment=>comment.
        //         postId=== ) 
        //     res.send(comments);

        // })

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
        // delete comment 
        app.delete('/Deletepost/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await postCollection.deleteOne(query);
            res.send(result)
        })
        app.get('/post', async (req, res) => {
            const post = await postCollection.find({}).sort({ like: -1 }).limit(3).toArray();
            res.send(post)
        })
        app.get('/Mediapost', async (req, res) => {
            const post = await postCollection.find({}).sort({ like: -1 }).toArray();
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
