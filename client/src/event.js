/**
 * Created by feng.pan on 14-9-24.
 */
(function () {
    var def = 'event';
    var obj = {};
    //obj._event = new EventEmitter;
    obj.get = function() {
        //return obj._event._callbacks;
    };



    for(var key in obj) {
        kv.set(def+'.'+key ,obj[key]);
    }
}());