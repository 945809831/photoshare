'use strict'
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Photo = require('../models/photo');
var Friend = require('../models/friend');

var messages = require('../middleware/messages');

/* 朋友列表页面 */
router.get('/', function(req, res) {
    var uid = req.session.user.id; // 获取当前用户的id
    Friend.findMyFriends(uid, function(err, friends) {
        if (err) return err;
        res.render('friend/friendsList', { friends: friends });
    })
});

/**
 *  按朋友的邮箱地址查找朋友
 */
router.post('/find', function(req, res) {
    var uid = req.session.user.id; // 获取当前用户的id
    var email = req.body.email;
    Friend.search(uid, email, function(err, friends) {
        if (err) return err;
        res.render('friend/findFriends', { friends: friends });
    });
});

/**
 * 同意成为朋友
 */
router.get('/accept/:uid', function(req, res) {
    var uid = req.params.uid;
    var currentUId = req.session.user.id;
    Friend.accept(currentUId, uid, function(err) {
        if (err) return err;
        res.redirect('/friend');
    });
});

/**
 * 拒绝成为胖友
 */
router.get('/refuse/:uid', function(req, res) {
    var uid = req.params.uid;
    var currentUId = req.session.user.id;
    Friend.refuse(currentUId, uid, function(err) {
        if (err) return err;
        res.redirect('/friend');
    });
});
/**
 * 添加新的朋友
 */
router.get('/add/:uid', function(req, res) {
    var uid = req.params.uid;
    var currentUId = req.session.user.id;
    Friend.add(currentUId, uid, function(err) {
        if (err) return err;
        res.redirect('/friend');
    });
});

module.exports = router;