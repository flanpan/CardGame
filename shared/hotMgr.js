/**
 * Created by feng.pan on 14-9-28.
 */

var fs = require('fs');
var path = require('path');

var HotMgr = function() {
    this.files = {};
    this.interval = 3000;
};

var pro = HotMgr.prototype;

pro.addDir = function(dir) {
    var self = this;
    fs.readdirSync(dir).forEach(function(filename) {
        var filePath = path.join(dir, filename);
        self.addFile(filePath);
    });
};

pro.addFile = function(file) {
    var filePath = path.resolve(file);
    var ext = path.extname(filePath);
    if(ext !== '.js' || ext !== '.json')
        return;
    var self = this;
    if(!this.files[filePath] && fs.existsSync(filePath)) {
        fs.watchFile(filePath, { persistent: true, interval: self.interval }, function(){
            if(require.cache[filePath]) {
                delete require.cache[filePath];
                require(filePath);
                console.warn('Reload file '+filePath+'.');
            }
        });
    }
};

module.exports = HotMgr;