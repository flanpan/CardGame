/**
 * Created by feng.pan on 14-9-22.
 */
(function () {
    // v.can
    var can = {
        'test':function(args) {
            return true;
        }
    };

    for(var key in can) {
        kv.add('v.can.'+key,can[key]);
    }
}());