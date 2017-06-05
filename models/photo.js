/**
 *   图片的数据库接口，用于存储、查找图片
 */

'use strict'
var conn = require('./connection.js');

// 定义图片的模型
function Photo(url, title, uploadTime, visibility, albumId) {
    this.url = url;
    this.title = title;
    this.uploadTime = uploadTime;
    this.visibility = visibility;
    this.albumId = albumId;
}

// 将图片信息存贮到数据库中
Photo.prototype.save = function(fn) {

};

//