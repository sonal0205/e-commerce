require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var flash = require('express-flash');
var session = require('express-session');
var bodyParser = require('body-parser');

//NODE_DOCKER_PORT = 8080

const cors = require('cors');
var mysql = require('mysql');


const app = express();

var connection = require('./db/conn');

var auth = require('./routes/auth');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
    secret: '123456cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
 
app.use(flash());
//app.use(expressValidator);

app.use('/auth', auth);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    //res.render('error');
});

const PORT = process.env.NODE_DOCKER_PORT || 8080;

app.listen(PORT, function () {
    console.log(`Node app is running on port ${PORT}`);
});
module.exports = app;
