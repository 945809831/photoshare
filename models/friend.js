/**
 *   朋友对象的数据库接口，用于存储、查找图片
 */

'use strict'
var conn = require('./connection.js');
/**
 * 构造函数
 */
function Friend() {

}

/**
 *  根据提供的名字在数据中查找朋友,如果在friend表中存在id1, id2行，则表明二人是朋友关系
 *  查找asker为uid（当前用户申请结识的朋友）及recipient为uid（当前用户被动接受为朋友）的用户，
 *  然后通过联合查询找到这些id在user表中的具体信息
 *  @param {string} keyword   搜索关键字,用来匹配用户邮箱地址
 *  @param {number} uid   当前登录用户的id
 */
Friend.search = function(uid, keyword, callback) {
    var sql = 'SELECT * FROM (SELECT u.id, u.email, u.nickname, u.avatar_url,f.status FROM user AS u LEFT JOIN ' +
        '(SELECT recipient, status FROM friend WHERE asker=? ' +
        'UNION SELECT asker, status FROM friend WHERE recipient=?) AS f ' +
        'ON u.id=f.recipient) AS r WHERE r.email LIKE ?';
    var param = '%' + keyword + '%';
    conn.query(sql, [uid, uid, param], function(err, results, fields) {
        if (err) return callback(err);
        callback(err, results);
    });
};

/**
 * 列出当前登录用户的好友,通过friend表找出当前用户的朋友id，通过连接查询找到这些id在user表中的
 * 具体信息
 * @param {number} uid  当前登录用户的id
 */
Friend.findMyFriends = function(uid, callback) {
    var sql = 'select u.id, u.email, u.nickname, u.avatar_url, f.status from user u ' +
        'inner join (select asker, status from friend where recipient=? and status=0 ' +
        'union select asker, status from friend where  recipient=? and status=1 ' +
        'union select recipient,status from friend where asker=? and status=1) f ' +
        'on u.id=f.asker';
    conn.query(sql, [uid, uid, uid], function(err, results, fields) {
        if (err) callback(err);
        callback(err, results);
    });
};
/**
 * 申请加为好友,在friend表中加入一行
 * @param {number} currentUId 当前登录的用户id
 * @param {number} uid   邀请成为朋友的id
 */
Friend.add = function(currentUId, uid, callback) {
    var sql = 'INSERT INTO friend(asker, recipient) VALUES(?, ?)';
    conn.query(sql, [currentUId, uid], function(err, results, fields) {
        if (err) callback(err);
        callback(err);
    });
};

/**
 * 同意加好友申请,将friend表中(currentUId, uid)所在行的status=1，表明二人为朋友
 * @param {number} currentUId 当前登录的用户id
 * @param {number} uid   邀请成为朋友的id
 */
Friend.accept = function(currentUId, uid, callback) {
    var sql = 'UPDATE friend SET status=1 WHERE asker=? AND recipient=?';
    conn.query(sql, [uid, currentUId], function(err, results, fields) {
        if (err) return callback(err);
        callback(err);
    });
};

/**
 * 拒绝加好友申请,在friend将 currentUId,uid所在行删除
 * @param {number} currentUId 当前登录的用户id
 * @param {number} uid   邀请成为朋友的id
 */
Friend.refuse = function(currentUId, uid, callback) {
    var sql = 'DELETE FROM friend WHERE asker=? AND recipient=?';
    conn.query(sql, [uid, currentUId], function(err, results, fields) {
        if (err) callback(err);
        callback(err);
    });
};


module.exports = Friend;