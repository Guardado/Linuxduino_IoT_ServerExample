// EXPRESS & NO SQL
// npm start
// npm install --save (module)
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

// build mini web app
const app = express();
app.use(morgan("combined")); // Prints all devices that have requested data.
app.use(bodyParser.json()); // Allows getting req.body.{jsonparam} in POST
app.use(cors()); // Allows cross-domain requests (http://domain-a can talk to http://domain-b)

// Run Server at port 8088
app.listen(8088);
console.log("Server Running at http://localhost:8088");

// Get message from raspberry pi
app.post("/rpimsg", function(req, res) {
  console.log("Raspberry Pi message:", req.body.rpimsg);

  // Return OK
  res.status(200).send({
    msg: req.body.rpimsg
  });
});

// Just send a message
app.get("/rpihello", function(req, res) {
  console.log("Hello World");

  // Return OK
  res.status(200).send({
    msg: "OK"
  });
});
