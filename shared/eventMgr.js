var KV = require('./kv');
var Event = require('events').EventEmitter;
var util = require('util');
var EventFunctions = require('./eventFunctions');

var EventMgr = function() {
    Event.call(this);
    this.events = {};
    this.kv = new KV;
    this.kv.f = new EventFunctions(this);
};

util.inherits(EventMgr,Event);

var pro = EventMgr.prototype;
module.exports = EventMgr;

/*
占位参数名fun,bifn,trace,res,deprecated
*/
pro.doFun = function(opts,trace,context) {
    if(!(context instanceof KV))
        context = KV(context);

    var args = opts;
    trace = trace || "";
    if(!args) return;
    if(typeof args == 'string') {
        //args = this.parseArgs(opts,context);
        //var trace =  trace + ' -> ' +args;
        this.doFun(this.kv.get(args),trace,context);
    } else if (_.isArray(args)) {

    } else if(_.isObject(args)) {
        if(args.deprecated) {
            return;
        }
        if(args.fun) {
            if(!_.isString(args.fun)) {
                return console.warn('doFun函数配置错误,fun不是字符串.');
            }
            if(args.fun[0] !== '$' && args.fun[0] !== '@') {
                args.fun = '$'+args.fun;
            }
            var argsNew = this.parseArgs(args,context,true);
            console.log(trace,'|参数:',argsNew);
            var fun,obj,r;
            /*
            if(typeof argsNew.fun === 'function') {
                fun = argsNew.fun;
                var newKey = _.str.strLeftBack(args.fun,'.');
                obj = this.parseArgs(newKey,context);
            }
            else if(typeof argsNew.fun === 'string') {
                fun = this.kv.get(argsNew.fun);

            }*/
            fun = argsNew.fun;
            if(typeof fun !== 'function') {
                return console.warn('doFun函数配置错误.');
            }
            if(argsNew.obj) {
                obj = argsNew.obj;
            } else {
                var newKey = _.str.strLeftBack(args.fun,'.');
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
                delete argsNew.fun;
                a.push(argsNew);
                //r = fun(argsNew,trace);
            }


            r = fun.apply(obj,a);

            if(argsNew.res)
                this.kv.set(argsNew.res,r);

            if(argsNew.bifn && !r)
                return;

        } else {
            for (var name in args) {
                if(name === 'bifn')
                    continue;
                var newTrace = trace + ' -> '+name;
                var d = args[name];
                var r = this.doFun(d, newTrace,context);
                if (args.bifn && !r)
                    return;
            }
        }
    } else {
        return console.log(trace,'参数不正确.')
    }
};


pro.parseArgs = function(args,context,isRecursive) {
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
            if(isRecursive) {
                argsBak[i] = this.parseArgs(args[i],context,isRecursive);
            } else {
                argsBak[i] = this.parseArgs(args[i],context);
            }
        }
    } else if(_.isObject(args)) {
        argsBak = {};
        for(var key in args) {
            if(isRecursive) {
                argsBak[key] = this.parseArgs(args[key],context,isRecursive);
            } else {
                argsBak[key] = this.parseArgs(args[key],context);
            }
        }
    } else {
        argsBak = args;
    }
    return argsBak;
};

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
            //context = KV(context);
            //e = self.parseArgs(e,context);
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
