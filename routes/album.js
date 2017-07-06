'use strict'
var express = require('express');
var router = express.Router();

var Album = require('../models/album');

router.get('/listByOwner', function(req, res, next) {
    var uid = req.session.user.id;
    Album.listByOwner(uid, function(err, albums) {
        res.render('', { albums: ablums });
    });
});

router.get('/add', function(req, res, next) {

});

module.exports = router;