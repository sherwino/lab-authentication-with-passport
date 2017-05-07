//so these are all of the packages that my app depends on
const express         = require('express');
const path            = require('path');
const favicon         = require('serve-favicon');
const logger          = require('morgan');
const cookieParser    = require('cookie-parser');
const bodyParser      = require('body-parser');
const layouts         = require('express-ejs-layouts');
const mongoose        = require('mongoose');
const session         = require('express-session');
const bcrypt          = require('bcrypt');
const passport        = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
const flash           = require('connect-flash');
const passportSetup   = require('./config/passport-config.js');
//this is the model that we want to use for the users in the app
const User            = require('./models/user.js');

//these are the routes that I want to import into the app.js
const index           = require('./routes/index');
const users           = require('./routes/users');
const passRouter      = require('./routes/passportRouter');

//this will create a mongodb and connect to it the app
mongoose.connect('mongodb://localhost/passAuthLab');

//initialize express
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//default title for the website
app.locals.title = 'Authentication With Passport';
//this is where all the middleware goes
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
//enable sessions here
//create a session cookie for the people visiting site
//before using passport
app.use(session ({
  secret: 'this is going to turn into a session cookie, I think...',
  //these two options are going to prevent warnings, I guess browser warnings
  resave:             true,
  saveUninitialized:  true
}) );



//initialize passport and session here
//first you have to initialize the passport package
app.use(passport.initialize());
//then you have to call the session
app.use(passport.session());

app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
});

//passport code here
passportSetup();

//lets use all of the routes that we imported into app.js
app.use('/', index);
app.use('/', users);
app.use('/', passRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
