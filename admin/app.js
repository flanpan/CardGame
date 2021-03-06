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

var designMainPath = './design/main.json';

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


var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({port: 7002});
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        var body = JSON.parse(message);
        //console.log('保存',body.jsonPath,body.json);
        fs.writeFileSync(body.jsonPath, body.json);
        ws.send('保存成功!');
    });
    //ws.send('something');
});

app.on('error', function(err) {
    return console.error("app on error:" + err.stack);
});

/*
var getJsonPath = function(name) {
    var config, node;
    config = require(designMainPath);
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
*/
app.post('/getJson', function(req, res) {
    var json;
    var file = req.body.jsonPath;
    if(!file) return;
    var resourceFullPath = path.resolve(file);
    delete require.cache[resourceFullPath];
    if (fs.existsSync(file)) {
        try{
            json = require(file);
        } catch(e) {
            json = {};
        }

        if(file === designMainPath && !req.body.isDesign) {
            json = formathMain(json);
        }

        if(req.body.isBearcat) {
            json = bearcat2json(json);
        }
    }
    return res.send(json);
});

var bearcat2json = function(obj) {
    if(obj.beans) {
        var beans = {};
        obj.beans.forEach(function(bean){
            beans[bean.id] = bean;
            bean.id = undefined;
            if(bean.props) {
                var props = {};
                bean.props.forEach(function(prop){
                    props[prop.name] = prop;
                    prop.name = undefined;
                });
                bean.props = props;
            }

            if(bean.args) {
                var args = {};
                bean.args.forEach(function(arg){
                    args[arg.name] = arg;
                    arg.name = undefined;
                });
                bean.args = args;
            }
        });
        obj.beans = beans;
    }
    return obj;
};

var json2bearcaat = function(str) {
    var obj = JSON.parse(str);
    if(obj.beans) {
        var beans = [];
        for(var key in obj.beans) {
            var bean = obj.beans[key];
            bean.id = key;
            beans.push(bean);
            if(bean.props) {
                var props = [];
                for(var key in bean.props) {
                    var prop = bean.props[key];
                    prop.name = key;
                    props.push(prop);
                }
                bean.props = props;
            }

            if(bean.args) {
                var args = [];
                for(var key in bean.args) {
                    var arg = bean.args[key];
                    arg.name = key;
                    args.push(arg);
                }
                bean.args = args;
            }

        }
        obj.beans = beans;
    }
    return JSON.stringify(obj);
};

app.post('/saveJson', function(req, res) {
    if(req.body.isBearcat) {
        req.body.json = json2bearcaat(req.body.json);
    }
    fs.writeFileSync(req.body.jsonPath, req.body.json);
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
    config = require(designMainPath);
    return resp.render('index', config['登录管理']);
});

app.get('/design/', function(req, resp) {
    return resp.render('design.html');
});

app.get('/module/:mname', function(req, resp) {
    return resp.render(req.params.mname);
});

var formathMain = function(json) {
    var data = json['菜单管理'];

    var jsonDirFormat = function(dir) {
        var arr = []
        var files = fs.readdirSync(dir);
        for(var i = 0; i<files.length;i++) {
            var newPath = dir+'/'+files[i];
            if (fs.existsSync(newPath)) {
                var stat = fs.statSync(newPath);
                if(stat.isDirectory()) {
                    var obj = {};
                    obj.id = newPath;
                    obj.text = files[i];
                    obj['children'] = jsonDirFormat(newPath);
                    obj['expanded'] = false;
                    obj['leaf'] = false;
                    arr.push(obj);
                } else if(stat.isFile) {
                    if(path.extname(files[i]) !== '.json') continue;
                    var obj = {};
                    obj.text = path.basename(files[i], '.json');
                    obj.id = newPath;
                    obj.jsonPath = newPath;
                    obj['leaf'] = true;
                    arr.push(obj);
                }
            }
        }
        return arr;
    }

    var format = function(children) {
        var arr = [];
        for(var text in children) {
            var obj = children[text];
            for(var key in obj) {
                if(key == 'children') {
                    obj[key] = format(obj[key]);
                }
                if(key == 'jsonPath') {
                    var path = obj[key];
                    if (fs.existsSync(path)) {
                        var stat = fs.statSync(path);
                        if(stat.isDirectory()) {
                            obj['children'] = jsonDirFormat(path);
                            obj['expanded'] = false;
                            obj['leaf'] = false;
                        }
                    }
                }
            }
            obj.text = text;
            arr.push(obj);
        }
        return arr;
    };

    data['children'] = format(data['children']);
    return json;
};

app.listen(7001);

console.log('[AdminConsoleStart] visit http://localhost:7001');

