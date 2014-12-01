/**
 * Created by feng.pan on 14-9-29.
 */

var getFiles = require('./getFiles');
var KV = require('./kv');
var path = require('path');
var _str = require('underscore.string');
var fs = require('fs');

var getCfgs = function(dir,isWatch) {
    var files = getFiles([dir],['.json']);
    var kv = new KV;
    var basePath = path.resolve(dir);
    files.forEach(function(p){
        var cfg = require(p);
        var key = _str.strLeftBack(p,'.');
        key = key.substr(basePath.length+1);
        key = key.replace(/\//g,'.');
        key = key.replace(/\\/g,'.');
        kv.set(key,cfg);
        if(isWatch) {
            watch(p,kv,key)
        }
    });
    return kv;
};

var watch = function(p,kv,key) {
    fs.watchFile(p, { persistent: true, interval: 3000 }, function(){
        if(require.cache[p]) {
            delete require.cache[p];
            kv.set(key,require(p));
            console.log('Reload file '+p+',update kv key:'+key);
        }
    });
};

module.exports = getCfgs;
