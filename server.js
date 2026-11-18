const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config({ path: "./config.env"});
const URI = process.env.URI;
const client = new MongoClient(URI);
const db = client.db("afterschool");

const port = process.env.PORT || 8080;

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

//search lessons by title, location, price or availability
app.get("/search", async function(request, response) {
  console.log("In comes a request to: " + request.url);

  // the search text from the URL, e.g. /search?q=ea, made lowercase so the search isn't case-sensitive
  let searchText = (request.query.q || "").toLowerCase();

  let collection = await db.collection("lessons");
  let lessons = await collection.find({}).toArray();

  // keep only the lessons where at least one field contains the search text
  let results = lessons.filter(function(lesson) {
    return lesson.name.toLowerCase().includes(searchText) ||
           lesson.location.toLowerCase().includes(searchText) ||
           String(lesson.price).includes(searchText) ||
           String(lesson.availableInventory).includes(searchText);
  });

  response.json(results);
});

app.post("/orders", async function(request,response){
  console.log("In comes a request to: " + request.url);
  var body = request.body;
  let collection = await db.collection("orders");
  let result = await collection.insertOne(body);
  response.send(result);
});

//update lessons
app.put("/lessons/:_id", async function(request, response){
  var body = request.body;
  let collection = await db.collection("lessons");
  const query = { _id: new ObjectId(request.params._id) };
  const updates = {
    $set: request.body
  };
  result = await collection.updateOne(query, updates);
  response.send(result);

})

//Return 404 error
app.use(function(request, response, next){
  response.status(404).send("Page not found.");
});

app.listen(port, function() {
console.log("App started on port " + port);
});
