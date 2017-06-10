/**
 *   用户登录后才能访问的路由
 */
'use strict'
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

var Photo = require('../models/photo.js');

/* 显示用户上传的所有图片文件. */
router.get('/', function(req, res, next) {
    Photo.getAll(function(err, photos) {
        res.locals.user = req.session.user;
        res.locals.photos = photos;
        res.render('user');
    });
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
        var title = fields.title; // 上传图片的标题
        var comment = fields.comment; // 上传图片的评论内容
        // 获取上传文件的文件名
        var uploadFileName = path.basename(files.photo.path);
        var ext = files.photo.type; // 上传文件的类型 (image/jpeg形式)
        var src = files.photo.path; // 长传的文件在服务器的临时存放路径

        if (ext.startsWith('image/')) {
            // 使用path.format函数构造文件在服务器的存贮路径
            var dest = path.format({
                root: req.app.get('photolib') + '/',
                name: uploadFileName,
                ext: ext.replace('image/', '.')
            });
            // 将上传图片文件移动到服务器存储图片的目录中
            fs.rename(src, dest, function(err) {
                var ownerId = req.session.user.id;
                //可见性默认设置为P(Public)， 对所有人可见
                var photo = new Photo(dest, title, ownerId, 'P');
                photo.save(function(err) {
                    res.redirect('/users'); //如果成功存储，将页面重定向到用户首页
                });
            });
        } else {
            res.locals.user = req.session.user;
            res.locals.info = "所选的文件并非图片文件，请重新选择";
            res.render('uploadForm');
        }
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