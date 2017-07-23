'use strict'
var express = require('express');
var router = express.Router();

var Album = require('../models/album');
var Photo = require('../models/photo');

router.get('/listByOwner', function(req, res, next) {
    var uid = req.session.user.id;
    Album.listByOwner(uid, function(err, albums) {
        res.render('', { albums: ablums });
    });
});

router.post('/add', function(req, res, next) {
    var albumName = req.body.album;
    var uid = req.session.user.id;
    Album.addAlbum(albumName, uid, function(err) {
        if (err)
            res.render('error');
        else
            res.redirect('/users/');
    });
});

/**
 * 改变图片的可见性
 */
router.get('/changeVisibility', function(req, res, next) {
    var pid = req.query.pid;
    var visibility = req.query.vi;
    Photo.changeVisibility(pid, visibility, function(err) {
        if (err)
            res.send('ERROR');
        else
            res.send('SUCCESS');
    });
});

/**
 * 改变图片所在相册
 */
router.get('/changeAlbum', function(req, res, next) {
    var pid = Number(req.query.pid);
    var aid = Number(req.query.aid);
    var owner = Number(req.session.user.id);
    Photo.changeAlbum(pid, aid, owner, function(err) {
        res.redirect('/users/');
    });
});

/**
 *  删除相册
 */
router.get('/del', function(req, res, next) {
    var albumId = req.query.id;
    var uid = req.session.user.id;
    Album.delAlbum(albumId, uid, function(err, result) {
        if (err) {
            res.render('error');
        } else {
            res.redirect('/users/');
        }
    });
});

module.exports = router;