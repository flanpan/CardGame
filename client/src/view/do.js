/**
 * Created by feng.pan on 14-9-22.
 */
(function () {
    // v.do
    var action = {
        'test':function(args) {
            return true;
        }
    };
    for(var key in action) {
        kv.add('v.do.'+key,can[key]);
    }
}());