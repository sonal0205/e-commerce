var express = require('express');
var router = express.Router();
var connection = require('../db/conn');
var path = require('path');

router.get('/init', function(req, res, next) {
    connection.query('CREATE TABLE IF NOT EXISTS `users`( `id` int(11) NOT NULL PRIMARY KEY DEFAULT 1,`name` varchar(50) NOT NULL,`password` varchar(255) NOT NULL,`email` varchar(100) NOT NULL UNIQUE) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;', 
    function(err, rows, fields) {
    if (err) throw err;
    console.log('Table created');
    res.redirect('/auth/register');
    })

});

router.get('/', function(req, res, next){    
    res.render(path.join(__dirname, '../views/Auth', 'login.ejs'), {
    title: 'Login',
    email: '',
    password: ''     
    })
})

router.get('/login', function(req, res, next) {
    res.render(path.join(__dirname, '../views/Auth', 'login.ejs'), {
    title: 'Login',
    email: '',
    password: '' 
    })
})

router.post('/authenticate', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    //console.log(req.body);
    connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(err, rows, fields) {
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

router.get('/register', function(req, res, next) {
    console.log("Register page: ");
    
    res.render(path.join(__dirname, '../views/Auth', 'register.ejs'), {
    title: 'Register',
    name: '',
    email: '',
    password: '' 
    })
    /*
    console.log("HTML page: ");
    try{
    res.sendFile(path.join(__dirname, 'register.html'));
    }
    catch(error) {
          console.error(error);
    }
    */
    
});

router.post('/post-register', function(req, res, next){  
    console.log(req.body);  
    //req.assert('name', 'Name is required').notEmpty()           //Validate name
    //req.assert('password', 'Password is required').notEmpty()   //Validate password
    //req.assert('email', 'A valid email is required').isEmail()  //Validate email
    if(req.body.name == '' || req.body.password == '' || req.body.email == ''){
        req.flash('error', 'Please enter all fields!')
        res.render(path.join(__dirname, '../views/Auth', 'register.ejs'), { 
        title: 'Registration Page',
        name: req.body.name,
        email: req.body.email,
        password: ''
        })
    }

    //var errors = req.validationErrors()
    //if( !errors ) {   //No errors were found.  Passed Validation!
    else
    {
        var user = {
        //name: req.sanitize('name').escape().trim(),
        //email: req.sanitize('email').escape().trim(),
        //password: req.sanitize('password').escape().trim()
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        connection.query('INSERT INTO users SET ?', user, function(err, result) {
        //if(err) throw err
        if (err) {
        req.flash('error', err)
        res.render(path.join(__dirname, '../views/Auth', 'register.ejs'), {
        title: 'Registration Page',
        name: '',
        password: '',
        email: ''                   
        })
        } else {     
            console.log("You have successfully signed up");           
        req.flash('success', 'You have successfully signup!');
        res.redirect('/auth/login');
        }
        })
    }
    
    })
    //display home page
router.get('/home', function(req, res, next) {
    console.log("We at home");
    if (req.session.loggedin) {
        res.render(path.join(__dirname, '../views/Auth', 'home.ejs'), {
        title:"Dashboard",
        name: req.session.name,     
    });
    } else {
        req.flash('success', 'Please login first!');
        res.redirect('/auth/login');
    }
    });
    // Logout user
router.get('/logout', function (req, res) {
    req.session.destroy();
    req.flash('success', 'Login Again Here');
    res.redirect('/auth/login');
});

router.get('/view-profile', function(req, res, next) {
    //console.log(req);
    if (req.session.loggedin) {
        res.render(path.join(__dirname, '../views/Auth', 'view-profile.ejs'), {
        title:"Dashboard",
        name: req.session.name,
        email: req.session.email,
        password: req.session.password
    });
    } else {
        req.flash('success', 'Please login first!');
        res.redirect('/auth/login');
    }
});

router.post('/update-profile', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;

    connection.query('UPDATE users SET name = ?, email = ? WHERE name = ?', [name, email, req.session.name], function(err, rows, fields) {
        if(err) throw err;

        req.flash('success', 'Profile Updated Successfully!');
        req.session.name = name;
        res.redirect('/auth/view-profile');
    })
});


module.exports = router;