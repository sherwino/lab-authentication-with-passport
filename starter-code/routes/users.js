const express = require('express');
const ensure = require('connect-ensure-login');

const routerThingy = express.Router();

ensure.ensureLoggedIn();
ensure.ensureNotLoggedIn();

routerThingy.get('/profile/edit',
//redirects to /login if you are not logged in
ensure.ensureLoggedIn('/login'),

(req, res, next ) => {
  //if not for ensureLoggedIn() we would have to do this: below
  // if (!req.user) {
  //   res.reditect('/login');
  //   return;
  // }
  res.render('./user/edit-profile-view.ejs');
});


module.exports = routerThingy;
