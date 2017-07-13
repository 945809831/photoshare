/**
 *   用户登录后才能访问的路由
 */
'use strict'
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var User = require('../models/user')
var Photo = require('../models/photo');
var Album = require('../models/album');
var Comment = require('../models/comment');

/* 显示用户的所有相册. */
router.get('/', function(req, res, next) {
    var uid = req.session.user.id;
    // Photo.getAll(uid, function(err, photos) {
    //     res.render('photo/photosList', { photos: photos });
    // });
    Album.listByOwner(uid, function(err, albums) {
        res.render('photo/albumsList', { albums: albums });
    });
});

/*列出用户相册中的图片 */
router.get('/albumPhotos', function(req, res, next) {
    var uid = req.session.user.id;
    var albumId = req.query.album;
    Photo.getPhotoByAlbum(uid, albumId, function(err, photos) {
        res.render('photo/photosList', { photos: photos });
    });
});
/**
 * =================用户对照片的评论=======================================
 */
router.get('/getPhotoComment', function(req, res, next) {
    var photoId = Number(req.query.pid);
    var url = req.query.url;
    var uid = req.session.user.id;

    Comment.getPhotoComment(photoId, uid, function(err, albums, comments) {
        if (err) {
            res.render('error', { message: '数据库错误' });
        } else {
            res.render('photo/photoComment', { pid: photoId, url: url, albums: albums, comments: comments });
        }
    });
});

/**
 * 添加评论内容
 */
router.post('/addComment', function(req, res, next) {
    var comment = req.body.comment;
    var pid = Number(req.body.photoId);
    var speakerId = req.session.user.id;
    if (comment === "")
        res.render('error', { message: "不能添加空的评论！", error: null });
    Comment.add(comment, pid, speakerId, function(err) {
        if (err) {
            res.render('error', { message: "数据库错误！", error: err });
        }
    });
});

// 打开用户上传图片页面
router.get('/uploadForm', function(req, res, next) {
    //res.locals.user = req.session.user;
    res.render('photo/uploadForm');
});

/**
 * 处理用户上传的图片文件, 将文件移动到文件存储路径，
 * 同时将图片路径信息写入数据库中
 *  @param {object} file 从formidable中解析出上传文件对象
 */
function moveUploadFile(file, destDir, callback) {
    var fileName = path.basename(file.path); // 文件名
    var type = file.type; //文件类型(image/jpeg)
    var srcPath = file.path; // 上传文件在服务器中临时路径
    var destPath = path.format({ // 准备实际图片路径
        root: destDir + '/',
        name: fileName.substring(7),
        ext: type.replace('image/', '.')
    });
    fs.rename(srcPath, destPath, function(err) {
        if (err) return callback(err);
        // url 为写入数据库中的图片文件实际访问地址, url存储为 '/photo/xxxxx.jpeg'格式
        var url = '/photo/' + path.basename(destPath);
        callback(null, url);
    });
}

// 上传图片路由
router.post('/upload', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var title = fields.title; // 上传图片的标题
        var comment = fields.comment; // 上传图片的评论内容
        var photo = files.photo; // 上传的图片文件对象
        var destDir = req.app.get('photolib'); // 获得服务器中图片的存储路径

        if (photo.type.startsWith('image/')) {
            moveUploadFile(photo, destDir, function(err, url) {
                var ownerId = req.session.user.id;
                //可见性默认设置为P(Public)对所有人可见, 创建photo对象，调用save方法存入数据库
                var photo = new Photo(url, title, ownerId, 'P');
                photo.save(function(err, url) {
                    if (err) return err;
                    res.redirect('/users');
                });
            });
        } else {
            //res.locals.user = req.session.user;
            res.error("所选的文件并非图片文件，请重新选择");
            res.render('photo/uploadForm');
        }
    });
});

/**
 *  用户设置页面表单
 */
router.get('/settingsForm', function(req, res, next) {
    //res.locals.user = req.session.user;
    res.render('user/settingsForm');
});

/**
 *  处理用户更改昵称、头像的设置
 */

router.post('/settings', function(req, res, next) {
    var user = req.session.user; // 当前用户
    var form = formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var nickname = fields.nickname; // 获取传入的昵称
        var avatar = files.avatar; // 用户头像文件名     
        var destDir = req.app.get('photolib');

        if (avatar.type.startsWith('image/')) {
            moveUploadFile(avatar, destDir, function(err, url) {
                var currentUser = new User(req.session.user);
                currentUser.changeNicknameAvatar(nickname, url, function() {
                    if (err) return err;
                    res.redirect('/users/settingsForm');
                });
            });
        } else {
            //res.locals.user = req.session.user;
            res.locals.info = "所选的文件并非图片文件，请重新选择";
            res.render('user/settingsForm');
        }
    });
});

/**
 * 获取朋友公开和朋友间可见的图片
 */
router.get('/friendPhotos', function(req, res, next) {
    console.log('friend Photos');
    var uid = req.query.uid;
    var friend = req.query.friend;
    Photo.getFriendPhoto(uid, function(err, photos) {
        if (err) return err;
        res.render('friend/friendPhotos', { friend: friend, photos: photos });
    });
});

module.exports = router;