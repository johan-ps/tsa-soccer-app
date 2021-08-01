require("dotenv").config()

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000

// Middleware
app.use(express.json()); // parse json bodies in the request object

// Redirect requests to endpoint starting with /api to index.js
const api = require('./routes/index');
app.use('/api/', api);

// Global Error Handler. IMPORTANT function params MUST start with err
app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: "Something went really wrong",
  });
});

const server = app.listen(port, () => {
    console.log(`running on port ${port}`);
});
