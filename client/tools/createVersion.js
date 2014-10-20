var fs = require('fs');
var path = require('path');
var EasyZip = require('easy-zip').EasyZip;
var zip = new EasyZip();

var majorVersionNumber = 0; // 主版本号
var minorVersionNumber = 0; // 次版本号
var revisionNumber = 0; // 修正版本号

var filesPath = './assetsManager/files.json';
var projectPath = './assetsManager/project.json';
var versionPath = './assetsManager/version.json';
var bakPath = './assetsManager/bak/';

var newFileList = {};
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
			newFileList[p] = t;
        }
    });
};

getFiles('../Resources');

var oldFileList = require(filesPath);
var fileProject = require(projectPath);
var fileVersion = require(versionPath);

var needUpdateFiles = {};
var isNeedUpdate = false;
for(var name in newFileList) {
	if(!oldFileList[name] || oldFileList[name] !== newFileList[name]) {
		needUpdateFiles[name] = newFileList[name];
		isNeedUpdate = true;
	}
}

var dateStr = moment().format('YYYYMMDDHHmmss')+'.'
if(isNeedUpdate) {
	fs.renameSync(filesPath,bakPath+dateStr+path.basename(filesPath)); 
	fs.renameSync(projectPath,bakPath+dateStr+path.basename(projectPath));
	fs.renameSync(versionPath,bakPath+dateStr+path.basename(versionPath));
	
	fs.writeFileSync(filesPath,JSON.stringify(newFileList));
	fs.writeFileSync(projectPath,JSON.stringify(projectPath));
	fs.writeFileSync(versionPath,JSON.stringify(versionPath));
}

console.log(needUpdateFiles);


zip.zipFolder('./assetsManager',function(){
    zip.writeToFile('./assetsManager/zip/'+dateStr+'zip');
});