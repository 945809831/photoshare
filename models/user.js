'use strict'
var crypto = require('crypto');
var conn = require('./connection.js');

// define User model
function User(email, password, nickname, avatar) {
    this.email = email;
    this.nickname = nickname;
    this.avatar = avatar;
    var res = User.hashPassword(password);
    this.salt = res[0];
    this.cryptoPassword = res[1];
}

/**
 *  如果user.id === undefined， 添加新用户到user表中
 *  如果user.id 存在，则更新用户的nickname, avatar
 */
User.prototype.save = function(fn) {
    var user = this;
    var sqlInsert = 'INSERT INTO user(email, salt, hash_password) VALUES(?, ?, ?)';
    var sqlUpdate = 'UPDATE user SET nickname=?, avatar_url=?, salt=?, hash_password=?' +
        ' WHERE id = ?';
    if (!user.id) {
        var params = [user.email, user.salt, user.cryptoPassword];
        conn.query(sqlInsert, params, function(err, results, fields) {
            if (err) return fn(err);
            fn(err);
        });
    } else {
        var params2 = [user.nickname, user.avatar, user.salt, user.cryptoPassword];
        conn.query(sqlUpdate, params2, function(err, results, fields) {
            if (err) return fn(err);
            fn(err);
        });
    }
};

User.hashPassword = function(passwd) {
    var salt = Math.round(new Date().valueOf() * Math.random()) + '';
    var cryptoPasswd = crypto.createHash('sha1')
        .update(salt + passwd)
        .digest('hex');
    return [salt, cryptoPasswd];
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
        var salt = user.salt;
        var cryptoPasswd = crypto.createHash('sha1')
            .update(salt + passwd)
            .digest('hex');
        if (cryptoPasswd === user.hash_password) {
            fn(null, user);
        } else {
            fn();
        }
    });
};


module.exports = User;