"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var dns = require("dns");

require("dotenv").config();

var cors = require("cors");
const bodyParser = require("body-parser");
const shortid = require("shortid");
const { resolve } = require("path");

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/



app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));



app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

var users = [];
const exercises = [];

function getUsernameById(id) {
  return users.find(user => user._id === id).username;
} 

app.post("/api/exercise/new-user", (req, res) => {
    const { username } = req.body;

    const newUser = {
      username,
      _id: shortid.generate()
    }

    users.push(newUser);

    res.json(newUser);
    console.log(users);
});


app.get("/api/exercise/users", (req, res) => {
  console.log(users);
  res.json(users);
});



app.post("/api/exercise/add", (req, res) => {
  const { userId, description, duration, date } = req.body;

  const dateObj = date === undefined ? new Date() : date;
  
  console.log(userId, description, duration, date);

  const newExercise = {
    _id: userId,
    description,
    duration,
    date: dateObj.toString()
  }

  exercises.push(newExercise);

  console.log(getUsernameById(userId));
  res.json({
    ...newExercise,
    username: getUsernameById(userId)
  });

});







// // Not found middleware
// app.use((req, res, next) => {
//   return next({status: 404, message: 'not found'})
// })

// // Error Handling middleware
// app.use((err, req, res, next) => {
//   let errCode, errMessage

//   if (err.errors) {
//     // mongoose validation error
//     errCode = 400 // bad request
//     const keys = Object.keys(err.errors)
//     // report the first validation error
//     errMessage = err.errors[keys[0]].message
//   } else {
//     // generic or custom error
//     errCode = err.status || 500
//     errMessage = err.message || 'Internal Server Error'
//   }
//   res.status(errCode).type('txt')
//     .send(errMessage)
// })

app.listen(port, function () {
  console.log("Node.js listening (v0.0.1) ... " + port);
});
