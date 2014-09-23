/**
 * Created by feng.pan on 14-9-23.
 */
(function (global) {
    var def = 'm';
    var m = {};
    //m.event = new EventEmitter;
    m.testCan = function() {
        return true;
    };

    m.testDo = function() {
        console.log('do');
    }

    for(var key in m) {
        kv.add(def+'.'+key ,m[key]);
    }
}(this));