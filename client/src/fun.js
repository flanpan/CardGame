/**
 * Created by feng.pan on 14-9-24.
 */
(function () {
    var def = 'f';
    var obj = {};
    //v.event = new EventEmitter;
    obj.testDo = function(args) {
        console.log('function');
    };


    for(var key in obj) {
        kv.set(def+'.'+key ,obj[key]);
    }
}());