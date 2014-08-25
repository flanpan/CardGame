var express = require('express');

var fs = require('fs');

var path = require('path');

var app = express();

//var db = require('mongoose');

//db.connect('mongodb://112.124.70.138/liangshan');

var pub = __dirname + '/public';

var view = __dirname + '/views';

app.configure(function() {
    app.set('view engine', 'html');
    app.set('views', view);
    app.engine('.html', require('ejs').__express);
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    return app.set('basepath', __dirname);
});

app.configure('development', function() {
    app.use(express["static"](pub));
    return app.use(express.errorHandler(function() {
      return {
        dumpExceptions: true,
        showStack: true
      };
    }));
});

app.configure('production', function() {
    var oneYear;
    oneYear = 31557600000;
    app.use(express["static"](pub, function() {
      return {
        maxAge: oneYear
      };
    }));
    return app.use(express.errorHandler());
});

app.on('error', function(err) {
    return console.error("app on error:" + err.stack);
});

var getJsonPath = function(name) {
    var config, node;
    config = require('./design/main');
    node = config['JSON管理'];
    if (node) {
      path = node[name];
    }
    if (!path) {
      path = './design/' + name + '.json';
    }
    return path;
    };

    app.post('/getFileJson', function(req, res) {
    var file, json, resourceFullPath;
    file = getJsonPath(req.body.json);
    resourceFullPath = path.resolve(file);
    delete require.cache[resourceFullPath];
    if (fs.existsSync(file)) {
      json = require(file);
    }
    return res.send(json);
});

app.post('/saveFileJson', function(req, res) {
    var desPath, srcPath;
    srcPath = getJsonPath(req.body.json);
    desPath = "./design/bak/" + req.body.json + "_" + (new Date().getTime()) + ".json";
    if (fs.existsSync(srcPath)) {
      fs.renameSync(srcPath, desPath);
    }
    fs.writeFileSync(srcPath, req.body.data);
    return res.send('保存成功!');
});

app.post('/getDBJson', function(req, res) {
    var data;
    data = req.body.json;
    //db.findOne();
    return res.send(data);
});

app.post('/saveDBJson', function(req, res) {
    var data;
    //data = db.connection.collection('cfg').findOne({
    //  name: req.body.json
    //});
    return res.send('保存成功!');
});

app.get('/', function(req, resp) {
    var config;
    config = require('./design/main');
    return resp.render('index', config['登录管理']);
});

app.get('/design/', function(req, resp) {
    return resp.render('design.html');
});

app.get('/module/:mname', function(req, resp) {
    return resp.render(req.params.mname);
});

app.listen(7001);

console.log('[AdminConsoleStart] visit http://localhost:7001');

