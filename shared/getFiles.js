/**
 * Created by feng.pan on 14-9-29.
 */
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
/*
getFiles(['./dir','./file','./dir1'],['.js','.json']);
*/
var getAllFiles = function(paths,exts) {
    var files = [];
    for(var i = 0; i<paths.length;i++) {
        var p = paths[i];
        if(path.basename(p)[0] == '.')
            continue;
        var stat = fs.statSync(p);
        if(stat.isDirectory()) {
            var newPaths = fs.readdirSync(p);
            for(var j = 0;j<newPaths.length;j++) {
                newPaths[j] = p+'/'+newPaths[j];
            }
            var subFiles = getAllFiles(newPaths,exts);
            files = files.concat(subFiles);
        } else if(stat.isFile()) {

            var ext = path.extname(p);
            var flag = false;
            for(var k = 0; k<exts.length;k++) {
                if(ext === exts[k]) {
                    flag = true;
                    break;
                }
            }
            if(flag) {
                files.push(path.resolve(p));
            }
        }
    }
    return files;
};

var getFiles = function(paths,exts) {
    var files = getAllFiles(paths,exts);
    return _.uniq(files);
};

module.exports = getFiles;