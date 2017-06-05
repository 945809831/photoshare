/**
 *   用户登录后才能访问的路由
 */
'use strict'
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var move = require('../models/move');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('user');
});

// 打开用户上传图片页面
router.get('/uploadForm', function(req, res, next) {
    res.locals.user = req.session.user;
    res.render('uploadForm');
});

// 上传图片路由
router.post('/upload', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        console.log(fields.title, fields.comment);
        console.log(files.photo);
        // var origPath = path.join(files.photo.path, files.photo.name);
        // var destPath = path.join('')
        res.end('upload complete!');
    });
});

/**
 *  用户设置页面表单
 */
router.get('/settingsForm', function(req, res, next) {
    res.locals.user = req.session.user;
    res.render('settingsForm');
});

module.exports = router;