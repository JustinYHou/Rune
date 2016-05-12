// Express Setup
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var path = require('path');
app.set('views', path.join(__dirname, './app/views'));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'jade');

// Middleware Setup
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

// Custom middleware to append trailing slashes to URL
app.use(function(req, res, next) {
    var url = req.path;
    var lastChar = url.substr(-1);

    if (lastChar != '/' && req.method == 'GET') {
        res.redirect(301, url+'/');
    } else {
        next();
    }
});

// Morgan Logging Setup
var morgan = require('morgan');
app.use(morgan('dev'));

// Authentication Setup
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
require('./config/passport')(passport);
app.use(session({ secret: 'really super secret key', cookie: { maxAge: 14400000 }, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Database Setup
var mongoose = require('mongoose');
var configDB = require('./config/db.js');
mongoose.connect(configDB.url);

app.locals.statuses = ["Backlog", "Selected for Development", "In Progress", "Completed"];

// All the routes are stored in routes.js, which point to individual controllers
require('./app/routes.js')(app, passport);

app.listen(port, function() {
    console.log('App is running on port ' + port);
});

exports = module.exports = app;
