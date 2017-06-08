/**
 *   用户登录后才能访问的路由
 */
'use strict'
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

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
        var uploadFileName = path.basename(files.photo.path);
        var ext = files.photo.type;
        var src = files.photo.path;

        var dest = path.format({
            root: req.app.get('photolib') + '/',
            name: uploadFileName,
            ext: ext.replace('image/', '.')
        });
        //var dest = path.join(req.app.get('photolib'), uploadFileName + '.' + ext.substring(ext.indexOf('/') + 1));
        fs.rename(src, dest, function(err) {
            res.end('finished!');
        });

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