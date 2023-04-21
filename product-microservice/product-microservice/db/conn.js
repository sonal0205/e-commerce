var mysql = require('mysql2');
//require('dotenv').config();
/*
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'ecommerce',
    port: 3306
});
*/

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dialect: 'mysql'
});

/*
var connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
    port: process.env.MYSQLDB_DOCKER_PORT
});

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'ecommerce',
    port: 3306
});
*/

connection.connect(function(err) {
    if (err) console.log(err);
    else
    console.log('Connected!');
});

module.exports = connection;