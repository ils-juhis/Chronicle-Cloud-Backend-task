const mysql = require('mysql');

const db = mysql.createConnection({
  host: "localhost",
  user: "juhi",
  password: "Juhi@123",
  database: "ebms",
  multipleStatements: true // to send multiple query
});

module.exports = db;