'use strict'
var crypto = require('crypto');
var conn = require('./connection.js');

// define User model
function User(obj){
    for(var key in obj){
        this.key = obj[key];
    }
}

User.prototype.save = function(fn){
    var user = this;
    var sqlInsert = 'INSERT INTO user(email, salt, password) '+
                'VALUES(?, ?, ?)';
    var sqlUpdate = 'UPDATE user ' +
                    'SET nickname=?, avatar=? '+
                    'WHERE id = ?';
    if( ! user.id ){
        var params = [user.email, user.nickname, user.avatar, user.salt, user.password];
        conn.query(sqlInsert, params , function(error, results, fields){
            if(error) fn(error);
            fn();
        });
    } else {
        var params2 = [user.nickname, user.avatar];
        conn.query(sqlUpdate, params2, function(error, results, fields) {
            if(error) fn(error);
            fn();
        });
    }
};

User.prototype.hashPassword = function(passwd) {
    var salt = Math.round(new Date().valueOf() * Math.random()) + '';
    var cryptoPasswd = crypto.createHash('sha512')
                             .update(salt + passwd)
                             .digest('hex');
    this.salt = salt;
    this.password = cryptoPasswd;
};


User.findByEmail = function(email, fn) {
    var sql = 'SELECT * FROM user WHERE email = ?';
    conn.query(sql, [email], function(error, results, fields) {
        if(error) return fn(error);
        if(results) {
            fn(null, new User(results[0]));
        } else {
            fn();
        }
    });
};

User.authenticate = function(email, passwd, fn) {
    User.findByEmail(email, function(error, user){
        if(error) return fn(error);
        var salt = user.salt;
        var cryptoPasswd = crypto.createHash('sha512')
                                 .update(salt + passwd)
                                 .digest('hex');
        if (cryptoPasswd === passwd){
            return fn(null, user);
        } else {
            fn();
        }
    });
};


module.exports = User;
