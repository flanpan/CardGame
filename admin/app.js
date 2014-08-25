var express = require('express');

var fs = require('fs');

var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler')
var app = express();

//var db = require('mongoose');

//db.connect('mongodb://112.124.70.138/liangshan');
/*
 if (process.env.NODE_ENV === 'development') {
 app.use(errorhandler())
 }
 */
var pub = __dirname + '/public';

var view = __dirname + '/views';

app.set('view engine', 'html');
app.set('views', view);
app.engine('.html', require('ejs').__express);
//app.use(methodOverride('_method'))
app.use(methodOverride());
//app.use(express.bodyParser());
//app.use(bodyParser.urlencoded());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.set('basepath', __dirname);


app.use(express["static"](pub));
app.use(errorhandler(function() {
  return {
    dumpExceptions: true,
    showStack: true
  };
}));


app.on('error', function(err) {
    return console.error("app on error:" + err.stack);
});

var getJsonPath = function(name) {
    var config, node;
    config = require('./design/main');
    node = config['JSON管理'];
    var path;
    if (node) {
      path = node[name];
    }
    if (!path) {
      path = './design/' + name + '.json';
    }
    return path;
};

app.post('/getJson', function(req, res) {
    var file, json, resourceFullPath;
    file = getJsonPath(req.body.json);
    resourceFullPath = path.resolve(file);
    delete require.cache[resourceFullPath];
    if (fs.existsSync(file)) {
      json = require(file);
    }
    return res.send(json);
});

app.post('/saveJson', function(req, res) {
    var desPath, srcPath;
    srcPath = getJsonPath(req.body.json);
    desPath = "./design/bak/" + req.body.json + "_" + (new Date().getTime()) + ".json";
    if (fs.existsSync(srcPath)) {
      fs.renameSync(srcPath, desPath);
    }
    fs.writeFileSync(srcPath, req.body.data);
    return res.send('保存成功!');
});

/*
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
*/

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

