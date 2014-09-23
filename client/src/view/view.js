/**
 * Created by flan on 2014/9/23.
 */
(function () {
    var def = 'v';
    var v = {};
    //v.event = new EventEmitter;
    v.testCan = function(args) {
        return true;
    };

    v.testDo = function(args) {
        console.log('do');
    }

    v.native = function(args) {
        //args.node[args.fun](args.args);
        var str = 'args.node.'+args.fun+'(';
        if(_.isArray(args.args)) {
            for(var i = 0; i<args.args.length;i++) {
                str += args.args[i];
                if(i != args.args.length-1) {
                    str += ','
                }
            }
        }
        str+=')';
        console.log(str);
        var res = eval(str);
        if(typeof args.return == 'string') {
            kv.set(args.return,res);
        }
    };


    for(var key in v) {
        kv.set(def+'.'+key ,v[key]);
    }
}());