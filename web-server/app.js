var express = require('express');
var async = require('async');
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var Token = require('../shared/token');
var secret = require('../shared/config/session').secret;
var app = express();
var db = require('mongoose');
//var everyauth = require('./lib/oauth');
var config = require('./config/config.json');
var resource = null;
var compressRes = null;
db.connect('mongodb://127.0.0.1:27017/game');
var User = db.model('User', require('../shared/schema/user'));
//var Area = db.model('Area', new require('./schema/Area'));
//var Resource = db.model('Resource', new require('./schema/Resource'));
/*
Resource.find().sort({
date: -1
}).limit(1).exec(function(err, data) {
return resource = data;
});
*/
app.configure(function() {
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    //app.use(everyauth.middleware());
    app.use(app.router);
    app.use(express.errorHandler());
    app.use(express.errorHandler(function() {
        return {
            dumpExceptions: true,
            showStack: true
        };
    }));
});

app.get('/auth_success', function(req, res) {
    var token;
    if (req.session.userId) {
        token = Token.create(req.session.userId, Date.now(), secret);
        res.render('auth', function() {
            return {
                code: 200,
                token: token,
                uid: req.session.userId
            };
        });
    } else {
        res.render('auth', function() {
            return {
                code: 500
            };
        });
    }
});

app.post('/getResourceInfo', function(req, res) {
    res.send({
        compressRes: compressRes
    });
});
/*
app.post('/updateResourceInfo', function(req, res) {
    if (config.updateResPwd === req.body.pwd) {
        resource = JSON.parse(req.body.files);
        Resource.create({res: resource}, function(err, data) {
            if (err) {
                return res.send(err);
            }
            zlib.deflate(JSON.stringify(resource), function(err, buffer) {
                if (err) {
                    return res.send("压缩resource信息失败: " + err);
                }
                compressRes = buffer.toString('base64');
                res.send('更新完成!');
            });
        });
    } else {
        res.send('密码错误,更新失败.');
    }
});
*/
app.post('/getNumber', function(req, res) {
    res.send({id: new Date().getTime()});
});

app.post('/register', function(req, res) {
    var msg;
    msg = req.body;
    if (!msg.username || !msg.password) {
        return res.send({err: '用户名或密码不能为空!'});
    }
    User.findOne({username: msg.username}, function(err, user) {
        if (err) {
            return res.send({err: '连接服务器失败!'});
        }
        if (user) {
            return res.send({err: '用户名已存在!'});
        }
        User.create({id: new Date().getTime(),username: msg.username,password: msg.password}, function(err) {
            if (err) {
                return res.send({err: '注册失败,网络错误!'});
            }
            res.send({msg: '注册成功!'});
        });
    });
});

app.post('/login', function(req, res) {
    var msg, username, password;
    msg = req.body;
    console.log(msg);
    username = msg.username;
    password = msg.password;
    if (!username || !password) {
        return res.send({err: '用户名或密码不能为空!'});
    }
    User.findOne({username: msg.username}, function(err, user) {
        if (err) {
            return res.send({err: '连接服务器失败!'});
        }
        if (!user) {
            return res.send({err: '用户名不存在!'});
        }
        if (user.password !== msg.password) {
            return res.send({err: '密码不正确,请重新输入!'});
        }
        res.send({token: Token.create(user._id, Date.now(), secret),id: user._id});
    });
});

app.use('/', express["static"](__dirname + '/../client/'));

//app.use('/shared', express["static"](__dirname + '/../client/script/shared'));
//app.use('/res', express["static"](__dirname + '/../client/res'));

app.get('/../client/', function(req, res) {
    res.sendfile('index.html');
    console.log('Sent index.html');
});

app.listen(process.env.PORT || 3001);
console.log("Web server has started.\n Please log on http://127.0.0.1:3001/");
process.on('uncaughtException', function(err) {
    console.error(' Caught exception: ' + err.stack);
});
