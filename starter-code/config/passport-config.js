//what are going to do is put passport in a seperate file,
//but I will have to create a function so that it is called
//in the app.js file

function passportSetup () {

const bcrypt          = require('bcrypt');
const passport        = require('passport');
const session         = require('express-session');
const LocalStrategy   = require('passport-local').Strategy;
const User            = require('../models/user.js'); //


//PASSPORT GOES THROUGH THE FOLLOWING:
// -- 1. Our Form
// == 2. LocalStrategy callback
// -- 3. if succesful --- passport.serializeUser()

//determines what to save in the session (called when you login)
passport.serializeUser((user, cb) => {
//cb is short for callback
  cb(null, user._id);
});


//where to get the rest of the users' information (called on every request after)
passport.deserializeUser((userId, cb) => {
//query the database with the ID from the box
  User.findById(userId, (err, theUser) =>{
    if (err) {
      cb(err);
      return;
    }
//sending the users info to the passport
    cb(null, theUser);
  });

});



passport.use( new LocalStrategy (
  // 1st arg are just the options to customize the LocalStrategy
  //LocalStrategy assumes that you loginforms are going to be named <input name="username" <input name="password"
  //if it doesn't match what the passport assumes you have to define the names of the inputs below
  {
    //the usernameField is a STD key from passport it has to always be named this way
    usernameField: 'loginUsername',  //<----you could only customize the string
    passwordField: 'loginPassword'
   },
  //2nd argument is a callback for the logic that validates the login
  (loginUsername, loginPassword, next) => {
    User.findOne(
      { username: loginUsername },
      (err, theUser ) => {
        // tell passport if there was an error
        if (err) {
          next(err);
          return;
        }
        // telling passport if there is no user with the given username
        if (!theUser) {
          //   the err argument in this case is blank, and in the second arg fale means Log In Failed.
          //   we could customize the feedback messages
          next(null, false); //this is specific to passport, not express
          return;
        }

        //at this point the username is correct... so the next step is to check the password
        //bcrypt receives two arguments, the variable you are checking for and the original encryptedPassword
        if(!bcrypt.compareSync(loginPassword, theUser.encryptedPassword )) {
          // false in 2nd argument means log in Failed
          next(null, false);
          return;
        }
        //when we get to this point of the code....we have passed all of the validations
        //then we give passport the user's details, because there hasn't been an error
        next(null, theUser);
      }
    );
  }
) );
} //end of the passportSetup function

module.exports = passportSetup;
