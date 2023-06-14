const express = require('express');
const app=express()
const cors = require('cors');
require('dotenv').config()
const port=process.env.PORT||5000;


app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_Pass}@cluster0.yq5wikg.mongodb.net/?retryWrites=true&w=majority`;

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

const usersCollection=client.db("schoolDB").collection("users")
const classCollection=client.db("schoolDB").collection("class")
const instructorCollection=client.db("schoolDB").collection("instructor")
// post user
app.post('/users', async(req,res)=>{
    const item=req.body;
    const result=await usersCollection.insertOne(item)
    res.send(result)
})

// user update
// create admin

app.patch('/users/admin/:id',async(req,res)=>{
  const id=req.params.id
  const filter={_id: new ObjectId(id)}
  const updateDoc={
    $set:{
      role:"admin"
    }
  }
const result=await usersCollection.updateOne(filter,updateDoc);
res.send(result)

})
// create instructor
app.patch('/users/instructor/:id',async(req,res)=>{
  const id=req.params.id
  const filter={_id: new ObjectId(id)}
  const updateDoc={
    $set:{
      role:"instructor"
    }
  }
const result=await usersCollection.updateOne(filter,updateDoc);
res.send(result)

})

// get User
app.get('/users',async(req,res)=>{
  const data=req.body
  const result=await usersCollection.find().toArray()
  res.send(result)
})

// post class
app.post("/class",async(req,res)=>{
  const item=req.body
  const result=await classCollection.insertOne(item)
  res.send(result)
})

// get class
app.get('/class',async(req,res)=>{
    const result=await classCollection.find().toArray();
    res.send(result)
})

app.get('/instructor',async(req,res)=>{
const result=await instructorCollection.find().toArray()
res.send(result)
})



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send("Summer school is running")
})

app.listen(port,()=>{
    console.log(`Summer school is running on ${port}`)
})