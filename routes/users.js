var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
   res.render('user', {user: "韦小宝"});
});

module.exports = router;
