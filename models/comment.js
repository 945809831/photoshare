/**
 *   图片评论的数据库接口
 */

'use strict'
var conn = require('./connection.js');

// 定义图片的模型
function Comment() {

}
// 添加新对照片(id=pid)的评论
Comment.add = function(content, pid, speaker, callback) {
    var sql = 'INSERT INTO comment(content, photo_id, issue_date, speaker_id) ' +
        'VALUES(?, ?, NOW(), ?)';
    conn.query(sql, [content, pid, speaker], function(err, results, fields) {
        callback(err);
    });
};

// 获取照片相关的评论和用户所有的相册信息
Comment.getPhotoComment = function(pid, owner, callback) {
    var sqlGetAlbums = 'SELECT * FROM album WHERE owner=?';
    var sqlGetComments = 'SELECT content, issue_date, speaker_id FROM comment WHERE photo_id=?';
    conn.query(sqlGetAlbums, [owner], function(err, results, fields) {
        if (err) return callback(err);
        var albums = results;
        conn.query(sqlGetComments, [pid], function(err, results, fields) {
            if (err) return callback(err);
            callback(err, albums, results);
        });
    });
};

module.exports = Comment;