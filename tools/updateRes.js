var fs = require('fs');
var http = require('http');

var args = process.argv.slice(2);
var path = args[0];
var ip = args[1];
var port = args[2];
var remotePath = args[3];
var pwd = args[4];
if (!path)
    path = '../client/CocoStudio/assets';
if (!ip)
    ip = '127.0.0.1';
if (!port)
    port = 3001;
if (!remotePath)
    remotePath = '/updateResourceInfo';
if (!pwd)
    pwd = 'updAte res';

var files = [];
// 深度优先遍历方式
var getFiles = function(dir) {
    var arr = fs.readdirSync(dir);
    arr.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            getFiles(dir + '/' + file);
        } else {
            var obj = {};
            var p = dir + '/' + file;
            var t = (new Date(fs.statSync(p).mtime)).getTime();
            p = p.substring(path.length + 1, p.length);
            var file = {};
            file.file = p;
            file.date = t;
            files.push(file);
        }
    });
};

getFiles(path);

var options = {
    hostname: ip,
    port: port,
    path: remotePath,
    method: 'POST'
};

var req = http.request(options, function(res) {
    console.log('CODE: ' + res.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(res.headers));
    //res.setEncoding('utf8');
    res.on('data', function(chunk) {
        console.log("BODY: " + chunk);
    });
});
req.setHeader("Content-Type", "application/x-www-form-urlencoded");
req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
});

req.write('pwd=' + pwd + '&files=' + JSON.stringify(files));
req.end();