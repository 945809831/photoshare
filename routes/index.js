var express = require('express');
var router = express.Router();

var User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: null });
});

router.get('/registerForm', function(req, res, next) {
    res.render('auth/registerForm');
});

router.get('/loginForm', function(req, res, next) {
    res.render('auth/loginForm');
});

router.post('/login', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.pwd;

    User.authenticate(email, password, function(err, user){
        if(err) return next(err);
        if(user) {
            req.session.user = user;
            res.redirect('/users');
        } else {
            res.error('用户名或密码错误');
            res.redirect('back');
        }
    });
});

router.post('/regist', function(req, res, next) {
    var email = req.body.email;
    var passwd = req.body.passwd;

    User.findByEmail(email, function(err, user) {
        if(user){
          console.log("INFO: email has registed", user);
          res.error('该邮箱地址已经注册了！');
          res.render('registForm');
        } else {
            var newUser = new User({email: email});
            newUser.hashPassword(passwd);
            newUser.save(function(err){
              if (err) return next(err);
              console.log('INFO: user login');
              res.redirect('/login');
            });
        }
    });

});

module.exports = router;
