/**
 * Created by feng.pan on 14-9-23.
 */
var _str = require('underscore.string');




var KV = function(obj) {
   if (obj) return mixin(obj);
};

function mixin(obj) {
    for (var key in KV.prototype) {
        obj[key] = KV.prototype[key];
    }
    return obj;
}

var pro = KV.prototype;

pro.set = function(k,v) {
    if(!k) {
        return console.error('add kv failed.');
    }
    var arr = _str.words(k,'.');
    var p = this;
    for(var i = 0; i<arr.length-1;i++) {
        var name = arr[i];
        if(typeof p[name] === 'undefined') {
            p[name] = {};
        }
        if (typeof p[name] !== 'object'){
            console.error('插入KV冲突',k);
            return;
        }
        p = p[name];
    }
    p[arr[arr.length-1]] = v;
};

pro.get = function(k) {
    if(!k)
        return this;
    var arr = _str.words(k,'.');
    var p = this;
    for(var i = 0; i<arr.length-1;i++) {
        var name = arr[i];
        if(typeof p[name] === 'undefined') {
            //console.error(name,'键没有定义');
            //p[name] = {};
            return;
        }
        /*
        if (typeof p[name] !== 'object'){
            console.error(name,'非叶子键不是object类型',k);
            return;
        }*/
        p = p[name];
    }
    return p[arr[arr.length-1]];
};

pro['=='] = function(a) {
    for(var k in a) {
        if(this.get(k) != a[k])
            return false;
    }
    return true;
}

pro['==='] = function(a) {
    for(var k in a) {
        if(this.get(k) !== a[k])
            return false;
    }
    return true;
}

pro['typeof'] = function(a) {
    for(var k in a) {
        if(typeof this.get(k) !== a[k])
            return false;
    }
    return true;
}

pro['='] = function(a) {
    for(var k in a) {
        this.set(k,a[k]);
    }
}



module.exports = KV;