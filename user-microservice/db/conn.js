var mysql = require('mysql2');
require('dotenv').config();

console.log(process.env.HOST);
console.log(process.env.DATABASE_NAME);
var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    database: process.env.DATABASE_NAME,
    password: process.env.DB_PASSWORD,
    
});


connection.connect(function(err) {
    if (err) console.log(err);
    else
    console.log('Connected!');
});

module.exports = connection;