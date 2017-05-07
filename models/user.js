'use strict'
var crypto = require('crypto');
var conn = require('./connection.js');

// define User model
function User(email, password) {
    this.email = email;
    var res = User.hashPassword(password);
    this.salt = res[0];
    this.cryptoPassword = res[1];
}

User.prototype.save = function(fn) {
    var user = this;
    var sqlInsert = 'INSERT INTO user(email, salt, password) VALUES(?, ?, ?)';
    var sqlUpdate = 'UPDATE user SET nickname=?, avatar=? WHERE id = ?';
    // debugger;
    if (!user.id) {
        var params = [user.email, user.salt, user.password];
        conn.query(sqlInsert, params, function(err, results, fields) {
            if (err) return fn(err);
            fn();
        });
    } else {
        var params2 = [user.nickname, user.avatar_url];
        conn.query(sqlUpdate, params2, function(error, results, fields) {
            if (error) return fn(error);
            fn();
        });
    }
};

User.hashPassword = function(passwd) {
    var salt = Math.round(new Date().valueOf() * Math.random()) + '';
    var cryptoPasswd = crypto.createHash('sha512')
        .update(salt + passwd)
        .digest('hex');
    return [salt, cryptoPasswd];
};


User.findByEmail = function(email, fn) {
    var sql = 'SELECT * FROM user WHERE email=?';
    conn.query(sql, [email], function(err, results, fields) {
        if (error) return fn(err);
        // debugger;
        if (results.lenghth === 0) {
            fn(null, null);
        } else {
            fn(null, results[0]);
        }
    });
};

User.authenticate = function(email, passwd, fn) {
    User.findByEmail(email, function(error, user) {
        if (error) return fn(error);
        var salt = user.salt;
        var cryptoPasswd = crypto.createHash('sha512')
            .update(salt + passwd)
            .digest('hex');
        if (cryptoPasswd === passwd) {
            return fn(null, user);
        } else {
            fn();
        }
    });
};


module.exports = User;
