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
Photo.getPhotoByAlbum = function(uid, albumId, fn) {
    var sql = 'SELECT * FROM photo WHERE owner=? AND album_id=? ORDER BY upload_time DESC';
    var sql2 = 'SELECT * FROM photo WHERE owner=? AND album_id IS NULL ORDER BY upload_time DESC';
    if (albumId) {
        var params = [uid, albumId];
        conn.query(sql, params, function(err, results, fields) {
            if (err) return fn(err);
            fn(err, results);
        });
    } else {
        var params2 = [uid];
        conn.query(sql2, params2, function(err, results, fields) {
            if (err) return fn(err);
            fn(err, results);
        });
    }

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
};

/**
 * 修改照片的可见性
 */
Photo.changeVisibility = function(pid, visibility, fn) {
    var sql = 'UPDATE photo SET visibility=? WHERE id=?';
    conn.query(sql, [visibility, pid], function(err, results, fields) {
        fn(err);
    });
}

/**
 *  改变照片所属相册
 */
Photo.changeAlbum = function(pid, aid, owner, fn) {
    var sql = 'UPDATE photo SET album_id=? WHERE id=? AND owner=?';
    conn.query(sql, [aid, pid, owner], function(err, results, fields) {
        fn(err);
    });
}

module.exports = Photo;