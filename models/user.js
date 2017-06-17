'use strict'
var crypto = require('crypto');
var conn = require('./connection.js');

/**
 *  定义User对象
 *  @param {Object} obj 包括email、password、nickname、avatar等属性
 */
function User(obj) {
    for (var key in obj) {
        this[key] = obj[key];
    }
}

/**
 *  如果user.id === undefined， 添加新用户到user表中
 */
User.prototype.save = function(fn) {
    var user = this;
    var sqlInsert = 'INSERT INTO user(email, salt, hash_password) VALUES(?, ?, ?)';
    var result = User.hashPassword(user.password);
    if (!user.id) {
        var params = [user.email, result.salt, result.cryptoPasswd];
        conn.query(sqlInsert, params, function(err, results, fields) {
            if (err) return fn(err);
            fn(err);
        });
    }
};
/**
 *  修改用户的头像和昵称
 */
User.prototype.changeNicknameAvatar = function(nickname, avatar, fn) {
    var sql = 'UPDATE user SET nickname=?, avatar_url=? WHERE id = ?';
    var uid = this.id;
    conn.query(sql, [nickname, avatar, uid], function(err, results, fields) {
        if (err) return fn(err);
        fn();
    });
};
/**
 *  加密用户密码，计算出加密后的密码和salt
 */
User.hashPassword = function(passwd) {
    var salt = Math.round(new Date().valueOf() * Math.random()) + '';
    var cryptoPasswd = crypto.createHash('sha1')
        .update(salt + passwd)
        .digest('hex');
    return { salt, cryptoPasswd };
};


User.findByEmail = function(email, fn) {
    var sql = 'SELECT * FROM user WHERE email=?';
    conn.query(sql, [email], function(err, results, fields) {
        if (err) return fn(err);
        // debugger;
        if (results.length === 0) {
            fn(err, null);
        } else {
            fn(err, results[0]);
        }
    });
};

User.authenticate = function(email, passwd, fn) {
    User.findByEmail(email, function(err, user) {
        if (err) return fn(err);
        if (user !== null) {
            var salt = user.salt;
            var cryptoPasswd = crypto.createHash('sha1')
                .update(salt + passwd)
                .digest('hex');
            if (cryptoPasswd === user.hash_password) {
                fn(null, user);
            } else {
                fn();
            }
        } else {
            fn();
        }

    });
};


module.exports = User;