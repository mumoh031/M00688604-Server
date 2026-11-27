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
var path = require("path");

app.use(cors());
app.use(express.json());

// logs every request: time, method, URL, and the status code once the response is sent
app.use(function(request, response, next) {
  const start = Date.now();
  response.on("finish", function() {
    console.log(
      new Date().toISOString() + " " + request.method + " " + request.originalUrl +
      " -> " + response.statusCode + " (" + (Date.now() - start) + "ms)"
    );
  });
  next();
});

// Sets up the path where the lesson images are stored on the server
var publicPath = path.resolve(__dirname, "staticFiles");
// Sends the image if it exists in staticFiles, e.g. /images/math.jpg -> staticFiles/math.jpg
app.use("/images", express.static(publicPath));
// If the image wasn't found, return an error message
app.use("/images", function(request, response){
  response.status(404).send("Image not found!");
});

app.get("/lessons", async function(request, response) {
  let collection = await db.collection("lessons");
  let results = await collection.find({}).toArray();

  response.json(results);
});

//search lessons by title, location, price or availability
app.get("/search", async function(request, response) {
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
  var body = request.body;
  let collection = await db.collection("orders");
  let result = await collection.insertOne(body);
  response.send(result);
});

// delete an order (used by Postman to clean up the test order it created)
app.delete("/orders/:_id", async function(request, response) {
  let collection = await db.collection("orders");
  let result = await collection.deleteOne({ _id: new ObjectId(request.params._id) });
  if (result.deletedCount === 0) {
    return response.status(404).json({ error: "Order not found." });
  }
  response.json(result);
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

// get every teacher 
app.get("/teachers", async function(request, response) {
  let collection = await db.collection("teachers");
  let results = await collection.find({}).toArray();
  response.json(results);
});

// get every lesson taught by one teacher
app.get("/teachers/:_id/lessons", async function(request, response) {
  let teachers = await db.collection("teachers");
  let teacher = await teachers.findOne({ _id: new ObjectId(request.params._id) });
  if (!teacher) {
    return response.status(404).json({ error: "Teacher not found." });
  }

  // find all lessons whose _id is in the teacher's list of lessonIds
  let lessons = await db.collection("lessons");
  let results = await lessons.find({ _id: { $in: teacher.lessonIds } }).toArray();
  response.json(results);
});

// create a teacher
app.post("/teachers", async function(request, response) {
  var body = request.body;

  //some sanity check to make sure every lesson id actually belongs to a lesson in the database
  let lessonIds = [...new Set(body.lessonIds)].map(function(id) { return new ObjectId(id); }); // using a set here to remove duplicates so the same lesson can't be counted twice
  let lessons = await db.collection("lessons");
  let foundCount = await lessons.countDocuments({ _id: { $in: lessonIds } });
  if (foundCount !== lessonIds.length) {
    return response.status(400).json({ error: "One or more lessonIds do not match a lesson." });
  }

  let teacher = {
    firstName: body.firstName,
    lastName: body.lastName,
    lessonIds: lessonIds
  };
  let teachers = await db.collection("teachers");
  let result = await teachers.insertOne(teacher);
  response.status(201).json(result);
});

// delete a teacher (mainly for testing purposes)
app.delete("/teachers/:_id", async function(request, response) {
  let teachers = await db.collection("teachers");
  let result = await teachers.deleteOne({ _id: new ObjectId(request.params._id) });
  if (result.deletedCount === 0) {
    return response.status(404).json({ error: "Teacher not found." });
  }
  response.json(result);
});

// count how many spaces of one lesson have been bought, by looking through every order
app.get("/enrolment/:lessonid", async function(request, response) {
  let lessonId = request.params.lessonid;

  let collection = await db.collection("orders");
  let orders = await collection.find({}).toArray();

  let enrolment = 0;
  for (const order of orders) {
    for (const lesson of order.lessonsOrdered || []) {
      if (lesson._id === lessonId) {
        enrolment = enrolment + 1;
      }
    }
  }

  response.json({ lessonId: lessonId, enrolment: enrolment });
});

//Return 404 error
app.use(function(request, response, next){
  response.status(404).send("Page not found.");
});

app.listen(port, function() {
console.log("App started on port " + port);
});
