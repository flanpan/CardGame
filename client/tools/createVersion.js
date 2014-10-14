var fs = require('fs');
var path = require('path');


var curFiles = {};
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
			curFiles[p] = t;
        }
    });
};

getFiles('../Resources');

var fileFiles = require('./assetsManager/files');
var fileProject = require('./assetsManager/project');
var fileVersion = require('./assetsManager/version');

var needUpdateFiles = {};

for(var name in curFiles) {
	if(!fileFiles[name] || fileFiles[name] !== curFiles[name])
		needUpdateFiles[name] = curFiles[name];
}

console.log(needUpdateFiles);