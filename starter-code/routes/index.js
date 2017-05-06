const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log('HOME-------------------');

  console.log('SESSION (from express-session)', req.session);
  //created by the express-session middleware
  console.log('USER (from passport)', req.user);
  //created by Passport

  console.log('\n');
  console.log('USER (from passport middleware)');
  console.log(req.user);

  res.render('index');
});

module.exports = router;
