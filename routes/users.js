var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('user');
});

router.get('/uploadForm', function(req, res, next) {
    res.locals.user = req.session.user;
    res.render('uploadForm');
});


module.exports = router;