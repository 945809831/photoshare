/**
 *  访问图片文件的路由，控制服务器图片目录中文件的访问
 */
'use strict'
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/:file', function(req, res, next) {
    //var id = req.params.id;  // 图片所有者id
    var fileName = req.params.file; // 所要访问的图片的文件名
    var dir = req.app.get('photolib');
    var absPath = path.join(dir, fileName);

    res.sendFile(absPath);
});

module.exports = router;