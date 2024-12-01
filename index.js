require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send("Simple Crud is running")
})

app.listen(port, () => {
  console.log('simple crud is running on port :', port)
})

const db_username = process.env.DB_USER;
const db_password = process.env.DB_PASS;
const uri = `mongodb+srv://${db_username}:${db_password}@cluster0.91k5x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const myDB = client.db("simpleCrudDB");
    const myColl = myDB.collection("usersCollection");

    app.post('/users', async (req, res) => {
      const users = req.body;
      const result = await myColl.insertOne(users);
      res.send(result);
      console.log("New User ", users)
    })
    
    app.get('/users', async(req,res)=>{
      const result = await myColl.find().toArray();
      res.send(result);
    })
    
    
    app.get('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id)};
      const result = await myColl.findOne(query)
      res.send(result);
    })
    app.delete('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id)};
      const result = await myColl.deleteOne(query)
      res.send(result);
    })
    
    app.put('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const user = req.body;
      const filter = { _id : new ObjectId(id)};
      const option = {upsert:true};

      const updatedUser = {
        $set:{
          name:user.name,
          email:user.email
        }
      }
      const result = await myColl.updateOne(filter,updatedUser,option);
      res.send(result);

    })
    

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir); 
