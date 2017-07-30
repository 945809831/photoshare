var express = require('express');
//var res = express.response;

module.exports = function(req, res, next) {
    if (req.session.user) {
        res.locals.user = req.session.user;
        next();
    } else if(req.path='/'){
        next();
    } else {
        res.error('请登录后访问该网址！');
        res.redirect('/loginForm');
    }
};