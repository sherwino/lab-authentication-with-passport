const express        = require("express");
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = bcrypt.genSaltSync(10);
const ensure         = require("connect-ensure-login");
const passport       = require("passport");


//initialize the router
const passRouter     = express.Router();

//----------------------------ROUTES -----------------------------

  //----------------------------------SIGNUP----------------------
  passRouter.get('/signup',
    //redirects to root directory if you are logged in
    ensure.ensureNotLoggedIn('/'),
    (req, res, next) => {
    res.render('passport/signup.ejs');
  });


  passRouter.post('/signup', (req, res, next) => {
    const signUser    = req.body.signupUsername;
    const signPass    = req.body.signupPassword;

    //Don't let users submit blank usernames or passwords
    if (signUser === '' || signPass === '') {
      res.render('passport/signup.ejs', {
      errorMessage: 'Please provide both a username and a password sucka'
      });
    return;
    }

  //IF YOU WANT TO CHECK PASSWORD LENGTH, CHARACTERS, ETC YOU WOULD DO IT HERE
    User.findOne(
      //first argument is the criteria which documents you want
      { username: signUser },
      //second argument is the projection, which field you want to see
      { username: 1 },
      //third argument callback
      ( err, foundUser ) => {
      //see if the db query had an error
        if (err) {
          next(err);
          return;
        }
      //Don't let the user regiter if the username is taken
        if (foundUser) {
          res.render('passport/signup.ejs', {
            errorMessage: 'Username is taken, dude'
          });
          return;
        }
      //not sure if I should put this at the top of the site.
        const encryptedPassHash = bcrypt.hashSync(signPass, bcryptSalt);

        //create the user
          const theUser = new User({
            username:           signUser,
            encryptedPassword:  encryptedPassHash

          });
          //save the use to the db, unless if there is an error
          theUser.save((err) => {
            if (err) {
              next(err);
              return;
            }
            res.redirect('/');
          });
        }
      );
    });

  //----------------------------------LOGIN----------------------
  passRouter.get('/login', (req, res, next) => {
    res.render('passport/login.ejs');

  });

  //<form method="post" actopm="/login">
  passRouter.post('/login',

  //redirects to root if you Are Logged In
  ensure.ensureNotLoggedIn('/'),

    passport.authenticate('local', { //using local as in 'LocalStrategy', { options }
    successRedirect: '/',      //instead of using regular express redirects we are using passport
    failureRedirect: '/login'
  } )
  );




  //----------------------------------LOGOUT----------------------

  passRouter.get('/logout', (req, res, next) => {
    req.logout(); //this a passport method

    res.redirect('/');
  });

//------------------------------------PRIVATE PAGE------------------

passRouter.get("/private-page", ensure.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});






module.exports = passRouter;
