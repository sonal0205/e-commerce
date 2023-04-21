var express = require('express');
var router = express.Router();
var connection = require('../db/conn');

router.get('/init', function(req, res, next) {
    connection.query('CREATE TABLE IF NOT EXISTS `users`( `id` int(11) NOT NULL PRIMARY KEY DEFAULT 1,`product` varchar(50) NOT NULL,`quantity` int(100)) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;', 
    function(err, rows, fields) {
    if (err) throw err;
    console.log('Table created');
    res.redirect('/auth/add');
    })

});

router.get('/', function(req, res, next){    
    res.render('auth/add', {
    title: 'Add',
    email: '',
    password: ''     
    })
})

router.get('/retrieve', function(req, res, next) {
    res.render('auth/retrieve', {
    title: 'Retrieve',
    email: '',
    password: '' 
    })
})
outer.post('/authenticate', function(req, res, next) {
    var name = req.body.name;
    var number = req.body.number;
    //console.log(req.body);
    connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [name, number], function(err, rows, fields) {
    if(err) throw err
    // if user not found
    if (rows.length <= 0) {
        req.flash('error', 'Please correct enter email and Password!')
        res.redirect('/login')
    }
    else { // if user found
        // render to views/user/edit.ejs template file
        req.session.loggedin = true;
        req.session.name = rows[0].name;
        console.log(req.session.name);
        res.redirect('/auth/home');
    }            
    })
})


router.get('/delete', function(req, res, next) {
    res.render('auth/delete', {
    title: 'delete',
    name: '',
    price: '',
    description: '' 
    })
})




module.exports = router;