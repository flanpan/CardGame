/**
 * Created by feng.pan on 14-9-29.
 */

var getFiles = require('./getFiles');
var KV = require('./kv');
var path = require('path');
var _str = require('underscore.string');

var getCfgs = function(dir) {
    var files = getFiles([dir],['.json']);
    var kv = new KV;
    var basePath = path.resolve(dir);
    files.forEach(function(p){
        var cfg = require(p);
        p = _str.strLeftBack(p,'.');
        p = p.substr(basePath.length+1);
        p = p.replace(/\//g,'.');
        p = p.replace(/\\/g,'.');
        kv.set(p,cfg);
    });
    return kv;
};

module.exports = getCfgs;
