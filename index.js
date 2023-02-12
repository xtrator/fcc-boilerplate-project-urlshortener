require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

// Mongo Configuration
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
};

// adding env variables to production
mongoose
  .connect(process.env.MONGO_URI, connectionParams)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Error connecting to the databse " + err);
  });

// Models
let URL = require("./src/models/URL");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use("/public", express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// WORKING HERE !!!!
app.post("/api/shorturl", async function (req, res) {
  let URLcount = await URL.countDocuments({});
  let url = new URL({ original_url: req.body.url, short_url: URLcount });
  url.save(function (err, data) {
    res.json({ original_url: data.original_url, short_url: data.short_url });
  });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  URL.findOne({ short_url: req.params.short_url }, function (err, data) {
    if (data) {
      res.redirect(data.original_url);
    }

    res.json({ error: "something wrong with your url" });
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
