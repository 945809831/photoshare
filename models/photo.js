/**
 *   图片的数据库接口，用于存储、查找图片
 */

'use strict'
var conn = require('./connection.js');

// 定义图片的模型
function Photo(url, title, owner, visibility) {
    this.url = url;
    this.title = title;
    this.owner = owner;
    this.visibility = visibility;
}

// 将图片信息存贮到数据库中
Photo.prototype.save = function(fn) {
    var sql = "INSERT INTO photo(url, title, upload_time, visibility, owner) " +
        "VALUES(?, ?, now(), ?, ?)";
    var params = [this.url, this.title, this.visibility, this.owner];
    conn.query(sql, params, function(err, results, fields) {
        if (err) return fn(err);
        fn(err);
    });
};

/**
 *  提取最近上传的8张图片
 */
Photo.getRecent = function(fn) {
    var sql = 'SELECT * FROM photo WHERE visibility="P" ORDER BY upload_time DESC';
    conn.query(sql, function(err, results, fields) {
        if (err) return fn(err);
        fn(err, results);
    });
}

/** 
 * 提取某个用户的全部图片信息
 * @param {number} uid  用户的id
 */
Photo.getAll = function(uid, fn) {
    var sql = 'SELECT * FROM photo WHERE owner=? ORDER BY upload_time DESC';
    var params = [uid];
    conn.query(sql, params, function(err, results, fields) {
        if (err) return fn(err);
        fn(err, results);
    });
};

/**
 * 提取某个用户的公开和朋友可见的图片信息
 */
Photo.getFriendPhoto = function(uid, fn) {
    var sql = 'SELECT * FROM photo WHERE owner=? AND (visibility="P" OR visibility="F") ' +
        'ORDER BY upload_time DESC';
    conn.query(sql, [uid], function(err, results, fields) {
        if (err) return fn(err);
        fn(err, results);
    });
}


module.exports = Photo;