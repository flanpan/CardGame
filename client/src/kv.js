/**
 * Created by feng.pan on 14-9-23.
 */
/*
 kv = {
 m.can
 m.do
 v.can
 v.do
 m.event
 v.event

 v.isFirstScene
 c....
 }
 */
(function (root) {
    var kv = {}
    kv.set = function(k,v) {
        if(!k) {
            return console.error('add kv failed.');
        }
        var arr = _.str.words(k,'.');
        var p = kv;
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

    kv.get = function(k) {
        var arr = _.str.words(k,'.');
        var p = kv;
        for(var i = 0; i<arr.length-1;i++) {
            var name = arr[i];
            if(typeof p[name] === 'undefined') {
                console.error(name,'键没有定义');
                //p[name] = {};
                return;
            }
            if (typeof p[name] !== 'object'){
                console.error(name,'非叶子键不是object类型',k);
                return;
            }
            p = p[name];
        }
        return p[arr[arr.length-1]];
    };

    root.kv = kv;
}(this));