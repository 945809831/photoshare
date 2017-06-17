var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var photos = require('./routes/photos');

var messages = require('./middleware/messages'); // 上下文消息中间件
var authenticate = require('./middleware/authenticate'); // 用户登录验证中间件

var app = express();

// view engine setup
app.set('./views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 设定图片在服务器中的存储路径
app.set('photolib', path.join(__dirname, 'photolib'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(session({
    secret: 'cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 }
}));
// .css .js及.html等网站静态文件的访问
app.use(express.static(path.join(__dirname, 'public')));

app.use(messages); // 自定义的用于传递请求层的信息的中间件
app.use('/photo', photos);
app.use('/', index);
app.use(authenticate); // 验证登录,必须放在不用登录可访问的路由之前，否则不需要登录的路由也不能访问
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;