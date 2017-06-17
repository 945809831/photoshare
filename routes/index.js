var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Photo = require('../models/photo');
var messages = require('../middleware/messages');

/* GET home page. */
router.get('/', function(req, res) {
    Photo.getRecent(function(err, photos) {
        if (err) return err;
        res.render('index', { photos: photos });
    });
});

/* 显示注册表单 */
router.get('/registerForm', function(req, res) {
    res.render('user/registerForm');
});

/*显示用户登录表单*/
router.get('/loginForm', function(req, res) {
    res.render('user/loginForm');
});

/* 用户登录过程 */
router.post('/login', function(req, res) {
    var email = req.body.email;
    var pwd = req.body.pwd;

    User.authenticate(email, pwd, function(err, user) {
        if (err) {
            return err;
        }
        if (user) {
            req.session.user = user;
            res.redirect('/users');
        } else {
            res.error('用户名或密码错误，请重新输入！');
            res.redirect('back');
        }
    });
});

/* 注册过程 */
router.post('/register', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.pwd;
    var confirmedPassword = req.body.pwd2;
    if (password !== confirmedPassword) {
        debugger;
        res.error('密码和确认密码不一致，请重新输入！');
        res.redirect('back');
    } else {
        User.findByEmail(email, function(err, user) {
            if (user) {
                res.error('该邮箱地址已经被注册了！');
                debugger;
                res.redirect('back');
            } else {
                var newUser = new User({ email: email, password: password });
                newUser.save(function(err) {
                    if (err) return next(err);
                    return res.redirect('/loginForm');
                });
            }
        });
    }
});

router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
});

module.exports = router;