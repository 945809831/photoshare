var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: null });
});

router.get('/registForm', function(req, res, next) {
    res.render('components/registForm');
});

router.get('/loginForm', function(req, res, next) {
    res.render('components/loginForm');
});

module.exports = router;
