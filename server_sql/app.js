// EXPRESS
// npm start
// npm install --save (module)
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const Sequelize = require("sequelize"); // sql Database

//
// EXPRESS APP INITIALIZATION
//
const app = express();
app.use(morgan("combined")); // Prints all devices that have requested data.
app.use(bodyParser.json()); // Allows getting req.body.{jsonparam} in POST
app.use(cors()); // Allows cross-domain requests (http://domain-a can talk to http://domain-b)

//
// SEQUELIZE INITIALIZATION (Defined in config.js)
//
const sequelize = new Sequelize(
  "myDB", // Database name
  "jorge", // User
  "1234", // Password
  {
    dialect: "sqlite", // Type of DB
    host: "localhost", //Telling sqlite the DB address
    storage: "./example.sqite" // where to store sqlite db
  }
);

//
// SQL SCHEMA (OR TABLES), To view tables: > .tables, To view table schema: > .schema <tableName>.
//
const Boards = sequelize.define("Boards", {
  board: Sequelize.DataTypes.STRING,
  presstimes: Sequelize.DataTypes.INTEGER
});

//
// EXPRESS ROUTES (GETs and POSTS)
//

// Useful sequelize functions
// {ModelName}.create()   // Creates table
// {ModelName}.findOne()  // Returns only one table
// {ModelName}.findAll()  // Returns a list of tables
// {ModelName}.findById() // Returns a table by Id

// Get message from raspberry pi
app.post("/rpimsg", async function(req, res) {
  console.log("Raspberry Pi message:", req.body.rpimsg);

  // Get current press time value
  // SELECT * FROM Boards WHERE board = 'RPI1' LIMIT 1;
  var RPI1Board = await Boards.findOne({
    where: {
      board: "RPI1"
    }
  });
  console.log("Press Times:", RPI1Board.dataValues.presstimes);

  // Update board "RPI1" with new value
  // UPDATE Boards SET presstimes=1 WHERE board = "RPI1";
  await Boards.update(
    { presstimes: RPI1Board.dataValues.presstimes + 1 },
    {
      where: {
        board: "RPI1"
      }
    }
  ).then(() => {
    console.log("Done Updating");
  });

  // Get new press time value
  // SELECT * FROM Boards WHERE board = 'RPI1' LIMIT 1;
  var RPI1Board = await Boards.findOne({
    where: {
      board: "RPI1"
    }
  });
  console.log("New Press Times:", RPI1Board.dataValues.presstimes);

  // Return OK
  res.status(200).send({
    msg: req.body.rpimsg
  });
});

// Just send a message
app.get("/rpihello", async function(req, res) {
  console.log("Hello World");

  // Return OK
  res.status(200).send({
    msg: "OK"
  });
});

// Run Server at port 8088
// sync({force: true}) drops all the tables
sequelize.sync({ force: true }).then(() => {
  app.listen(8088);
  console.log("Server Running at http://localhost:8088");

  Boards.create({
    board: "RPI1",
    presstimes: 0
  }).then(boards => {
    console.log(boards.toJSON());
  });
});
