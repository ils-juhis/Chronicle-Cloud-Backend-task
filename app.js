const express = require("express");
const app = express();
const db = require("./configs/DBconnection");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

///database
db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(express.json()); //Used to parse JSON bodies
app.use(cookieParser()); //middleware for cookies
dotenv.config();

db.query(`CREATE TABLE IF NOT EXISTS user (id VARCHAR(225) PRIMARY KEY, name TINYTEXT NOT NULL, email VARCHAR(30) NOT NULL UNIQUE KEY, password VARCHAR(225) NOT NULL, role VARCHAR(225) NOT NULL, mobileNo VARCHAR(20) NOT NULL, address MEDIUMTEXT, meterNo VARCHAR(225) UNIQUE KEY);`, 
  
  async function (error, results, fields) {
  if (error) throw error;
  console.log("user table created");
});

db.query(`CREATE TABLE IF NOT EXISTS tokens (id VARCHAR(225) PRIMARY KEY, refreshToken VARCHAR(225) NOT NULL);`, async function (error, results, fields) {
  if (error) throw error;
  console.log("tokens table created");
});

db.query(`CREATE TABLE IF NOT EXISTS bills (customerID VARCHAR(225) NOT NULL, billID VARCHAR(225) NOT NULL, billType TINYTEXT NOT NULL, DOG DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, unit_consumed	INT(250) NOT NULL, month VARCHAR(20) NOT NULL, year INT(4) NOT NULL, amountGen DECIMAL(11,5) NOT NULL, dueDate DATETIME, FOREIGN KEY (customerID) REFERENCES user(id) ON DELETE CASCADE);`, async function (error, results, fields) {
  if (error) throw error;
  console.log("bills table created");
});

app.use('/api/v1', authRoutes)
app.use('/api/v1', adminRoutes)


const port = process.env.PORT || 3000;
app.listen(port, ()=>{ console.log(`listening at port: ${port}`); })