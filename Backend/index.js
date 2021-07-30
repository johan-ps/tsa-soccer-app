require("dotenv").config()

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'tsaSocceerApp_1.0.0',
  database: 'tsa-soccer-app-dev',
});

app.get('/', (req, res) => {
    let date = new Date();
    const sqlinsert = `INSERT INTO ANNOUNCEMENTS (date, title, description, authorId, teams)
                        VALUES (${date}, 
                                'Sample Title',
                                'Sample description',
                                0,
                                [0, 1]
                        );`
    db.query(sqlinsert, (err, result) => {
      console.log(err)
      res.send("hello world");
    })
})

const server = app.listen(port, () => {
    console.log(`running on port ${port}`);
});
