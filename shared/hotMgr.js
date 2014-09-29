/**
 * Created by feng.pan on 14-9-28.
 */

var fs = require('fs');
var path = require('path');
var getFiles = require('./getFiles');

var HotMgr = function() {
    this.files = {};
    this.interval = 3000;
};

var pro = HotMgr.prototype;

pro.addFiles = function(paths,exts) {
    var files = getFiles(paths,exts);
    files.forEach(function(p) {
        fs.watchFile(p, { persistent: true, interval: self.interval }, function(){
            if(require.cache[p]) {
                delete require.cache[p];
                require(p);
                console.warn('Reload file '+p+'.');
            }
        });
    });
};

module.exports = HotMgr;