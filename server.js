const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config({ path: "./config.env"});
const URI = process.env.URI;
const client = new MongoClient(URI);
const db = client.db("afterschool");

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

connectToMongoDB();

var express = require("express");
var app = express();
var cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/lessons", async function(request, response) {
  console.log("In comes a request to: " + request.url);

  let collection = await db.collection("lessons");
  let results = await collection.find({}).toArray();

  response.json(results);
});

app.post("/orders", async function(request,response){
  console.log("In comes a request to: " + request.url);
  var body = request.body;
  let collection = await db.collection("orders");
  let result = await collection.insertOne(body);
  response.send(result);
});

//Return 404 error
app.use(function(request, response, next){
  response.status(404).send("Page not found.");
});

app.listen(8080, function() {
console.log("App started on port 8080");
});
