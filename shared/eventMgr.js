var KV = require('./kv');
//var Event = require('events').EventEmitter;
var util = require('util');
var EventFunctions = require('./eventFunctions');

var EventMgr = function() {
    //Event.call(this);
    //this.events = {};
    this.kv = new KV;
    //this._setKVFun(this.kv);
    //this._setBaseFun();
    this.kv.f = new EventFunctions(this);
};

//util.inherits(EventMgr,Event);

var pro = EventMgr.prototype;
module.exports = EventMgr;
/*
pro._parseStr = function(str,kv,$kv) {
    if(!str) return;
    if(typeof str !== 'string') {
        console.error('_parseStr参数类型不是string',str);
        return str;
    }
    if(str[0] === '$') {
        return $kv.get(str.substr(1));
    } else if(str[0] === '@') {
        return kv.get(str.substr(1));
    } else return str;
};

pro._setKVFun = function(kv) {
    kv['=='] = function(a) {
        for(var k in a) {
            if(kv.get(k) != a[k])
                return false;
        }
        return true;
    }

    kv['==='] = function(a) {
        for(var k in a) {
            if(kv.get(k) !== a[k])
                return false;
        }
        return true;
    }

    kv['typeof'] = function(a) {
        for(var k in a) {
            if(typeof kv.get(k) !== a[k])
                return false;
        }
        return true;
    }

    kv['='] = function(a) {
        for(var k in a) {
            kv.set(k,a[k]);
        }
    }
};*/

pro._createCb = function(aFunName,args) {
    var self = this;
    return function() {
        var context = null;
        if(arguments.length === 1)
            context = arguments[0];
        else if(arguments.length > 1)
            context = arguments;
        console.log('触发|',aFunName,'|上下文:',context);
        var trace = '执行| '+aFunName;
        self.doFun(args,trace,context);
    }
}
pro._cb = function(args) {
    var arr = [];
    for(var aFunName in args){
        var fun = this.kv.get(aFunName);
        if(typeof fun == 'function') {
            arr.push(fun);
            break;
        }
        fun = this._createCb(aFunName,args[aFunName]);
        this.kv.set(aFunName,fun);
        arr.push(fun);
    }
    if(arr.length === 0) return;
    else if(arr.length === 1) return arr[0];
    else return arr;
};


/*
占位参数名.f,.b,.r,.cb,.d
*/
pro.doFun = function(opts,trace,context) {
    if(!opts)
        return;
    if(!(context instanceof KV))
        context = KV(context);
    /*if(!context['=']) {
        this._setKVFun(context);
    }*/

    var args = opts;
    trace = trace || "";
    if(!args) return;
    if(typeof args == 'string') {
        return this.doFun(this.kv.get(args),trace,context);
    } else if (_.isArray(args)) {
        return true;
    } else if(_.isObject(args)) {
        if(args['.d']) {
            return true;
        }
        if(args['.cb']) {
            if(args['.f']) {
                if(typeof args['.cb'] !== 'string') {
                    return console.warn('回调函数缺少标识.')
                }
                var name = args['.cb'];
                delete args['.cb'];
                var tmp = {};
                tmp[name] = args;
                return this._cb(tmp);
            } else {
                return this._cb(args['.cb']);
            }
        }
        else if(args['.f']) {
            if(!_.isString(args['.f'])) {
                return console.warn('doFun函数配置错误,.f不是字符串.');
            }
            if(args['.f'][0] !== '$' && args['.f'][0] !== '@') {
                args['.f'] = '$'+args['.f'];
            }
            var strFun = args['.f'];
            trace += ' -> '+args['.f'].substr(1);
            if(args['.f'][0] === '$') {
                args['.f'] = this.kv.get(args['.f'].substr(1));
            } else if(args['.f'][0] === '@') {
                args['.f'] = context.get(args['.f'].substr(1));
            } else {
                return console.warn('doFun函数配置错误,不可能发生的.');
            }
            if(typeof args['.f'] !== 'function') {
                return console.warn('doFun函数配置错误,不可能发生的.');
            }

            var argsNew = this.parseArgs(args,context);

            console.log(trace,'|参数:',argsNew);
            var fun,obj,r;
            fun = argsNew['.f'];
            if(typeof fun !== 'function') {
                return console.warn('doFun函数配置错误.');
            }
            if(typeof argsNew.obj !== 'undefined') {
                obj = argsNew.obj;
            } else {
                var newKey = _.str.strLeftBack(strFun,'.');
                obj = this.parseArgs(newKey,context);
                //obj = argsNew.obj;
            }


            var a = [];
            if(typeof argsNew['1'] !== 'undefined') {
                var i = 1;
                while(true) {
                    if(typeof argsNew[i] !== 'undefined') {
                        a.push(argsNew[i]);
                        i++;
                    } else break;
                }
            } else {
                var args_tmp = JSON.parse(JSON.stringify(argsNew));
                delete args_tmp['.f'];
                delete args_tmp['.b'];
                delete args_tmp['.r'];
                delete args_tmp['.cb'];
                delete args_tmp['.d'];
                a.push(args_tmp);
            }

            r = fun.apply(obj,a);

            if(argsNew['.r'])
                this.kv.set(argsNew['.r'],r);

            if(typeof argsNew['.b'] != 'undefined') {
                if(argsNew['.b'] === true) { // 强制返回真
                    return true;
                }
                if(argsNew['.b'] === false) { // 强制返回假
                    return false;
                }
                if(!r) { // 如果.f的结果是假,执行.b，返回假
                    var newTrace = trace +' -> ' + '.b';
                    this.doFun(argsNew['.b'], newTrace, context);
                    return false;
                }
            }
            return r;
        } else {
            var flag = true;
            for (var name in args) {
                if(name === '.b')
                    continue;
                var newTrace = trace + ' -> '+name;
                var d = args[name];
                var r = this.doFun(d, newTrace,context);
                if (typeof args['.b'] != 'undefined') {
                    if(args['.b'] === true)
                        continue;
                    if(!r) {
                        var nnTrace = newTrace +' -> ' + '.b';
                        this.doFun(args['.b'], nnTrace, context);
                        flag = false;
                        break;
                    }
                }
            }

            if(flag || typeof args['.b'] === false) {
                var trace = trace + ' -> ' + '.b';
                this.doFun(args['.b'], trace, context);
                flag = false;
            }
            return flag;
        }
    } else {
        console.error(trace,'参数不正确.');
        return false;
    }
};

pro.parseArgs = function(args,context,trace,noDoFun) {
    var argsBak;
    if(_.isString(args) && args.length>0) {
        if(args[0] === '$') {
            argsBak = this.kv.get(args.substr(1));
        } else if(args[0] === '@') {
            argsBak = context.get(args.substr(1));
        } else {
            argsBak = args;
        }
    } else if(_.isArray(args)) {
        argsBak = [];
        for(var i = 0; i<args.length;i++) {
            argsBak[i] = this.parseArgs(args[i],context,trace);
        }
    } else if(args && typeof args === 'object') {
        if(!noDoFun) {
            if((args['.f'] && typeof args['.f'] === 'string') || args['.cb']) {
                return this.doFun(args,trace,context);
            }
        }
        else {
            argsBak = {};
            for(var key in args) {
                if(key == '.b') {
                    argsBak[key] = this.parseArgs(args[key],context,trace,true);
                } else
                    argsBak[key] = this.parseArgs(args[key],context,trace);
            }
        }
    } else {
        argsBak = args;
    }
    return argsBak;
};

/*

pro.createOnFun = function(eventName) {
    var self = this;
    var fun = function() {
        self.on(eventName,function(){
            var e = self.events[eventName];
            var context = null;
            if(arguments.length === 1)
                context = arguments[0];
            else if(arguments.length > 1)
                context = arguments;

            console.log('触发|',eventName,'|上下文:',context);
            var trace = '执行| '+eventName;
            self.doFun(e,trace,context);
        });
    };
    return fun();
};

pro.listenEvents = function(events) {
    for(var eventName in events) {
        this.events[eventName] = events[eventName];
        this.createOnFun(eventName)
    }
};
*/