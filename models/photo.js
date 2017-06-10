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

// 提取全部图片信息
Photo.getAll = function(fn) {
    var sql = 'SELECT * FROM photo ORDER BY upload_time';
    conn.query(sql, function(err, results, fields) {
        if (err) return fn(err);
        fn(err, results);
    });
};


module.exports = Photo;