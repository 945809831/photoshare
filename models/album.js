/**
 *   相册对象的数据库接口，用于存储、查找图片
 */
'use strict'
var conn = require('./connection.js');

function Album() {

}

Album.listByOwner = function(owner, callback) {
    var sql = '(SELECT f.how_many, f.url, a.name, a.id FROM ' +
        '(SELECT count(*) how_many, url, album_id FROM photo WHERE owner=? GROUP BY album_id) f ' +
        'RIGHT JOIN (select * from album where owner=?) a ON f.album_id=a.id) UNION ' +
        '(SELECT count(*) how_many, url, "未分类",album_id FROM photo WHERE owner=? AND album_id is NULL GROUP BY album_id)';
    conn.query(sql, [owner, owner, owner], function(err, result, fields) {
        if (err) return callback(err);
        callback(err, result);
    });
};
/**
 * 增添新的相册
 */
Album.addAlbum = function(name, owner, callback) {
    var sql = 'INSERT INTO album(name, create_time, owner) VALUES(?, now(), ?)';
    conn.query(sql, [name, owner], function(err, result, fields) {
        // if (err) return callback(err);
        callback(err);
    });
};

/**
 * 删除id为albumId的相册
 */
Album.delAlbum = function(albumId, owner, callback) {
    var sql = 'DELETE FROM album WHERE id=? AND owner=?';
    conn.query(sql, [albumId, owner], function(err, result, fields) {
        callback(err, result);
    });
};

module.exports = Album;