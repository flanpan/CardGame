/**
 * Created by feng.pan on 14-9-23.
 */
(function () {
    var def = 'm.bag';
    var bag = {};
    bag.testCan = function() {
        return true;
    };

    bag.testDo = function() {
        console.log('do');
    }

    for(var key in bag) {
        kv.set(def+'.'+key ,bag);
    }
}());