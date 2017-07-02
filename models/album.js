/**
 *   相册对象的数据库接口，用于存储、查找图片
 */
'use strict'
var conn = require('./connection.js');

Album.listByOwner = function(owner, callback) {
    var sql = 'SELECT f.how_many, f.url, a.name, a.id FROM ' +
        '(SELECT count(*) how_many, url, album_id FROM photo WHERE owner=? GROUP BY album_id) f ' +
        'LEFT JOIN album a ON f.album_id=a.id';
    conn.query(sql, [owner], function(err, result, fields) {
        if (err) return callback(err);
        callback(err, result);
    });
};

Album.addAlbum = function(name, owner, callback) {
    var sql = 'INSERT INTO album(name, create_time, owner) VALUES(?, now(), ?)';
    conn.query(sql, [name, owner], function(err, result, fields) {
        // if (err) return callback(err);
        callback(err);
    });
}

module.exports = Album;