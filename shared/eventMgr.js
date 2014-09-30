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
pro.emit = function(event) {
    //this.curEvent = event;
    return Event.prototype.emit.call(this,event);
};
*/
/*
events = {
    listenerId:{
        'event1':{
            can:{
                canId:{
                    param:param
                }
            },
            do:{
                doId:{
                    param:param
                }
            }
        }
    }
}


pro.can = function(args) {
    if(!args)
        return true;
    if(typeof args === 'string') {
        if(!this.can(this.kv.get(args)))
            return false;
    } else if (_.isArray(args)) {
        for (var i = 0; i<args.length;i++) {
            var c = args[i];
            console.log('can:', c.fun, c.args)
            if (typeof c == 'object') {
                if (!this.kv.get(c.fun)(c.args))
                    return false;
            } else {
                console.error(c.desc, '配置错误.');
                return false;
            }
        }
    } else {
        console.error(args, '配置错误.');
        return false;
    }
    return true; // 默认返回true
};

pro.do = function(args) {
    if(!args) return;
    if(typeof args == 'string') {
        this.do(this.kv.get(args));
    } else if(_.isArray(args)) {
        for (var i = 0; i<args.length;i++) {
            var d = args[i];
            console.log('do:', d.fun, d.args)
            if (typeof d == 'object') {
                this.kv.get(d.fun)(d.args);
            } else {
                console.error(d.desc, '配置错误.');
                return;
            }
        }
    } else {
        return console.log(args,'do 参数不正确.')
    }
};
*/

/*
占位参数名fun,bifn
*/
pro.doFun = function(args) {
    if(!args) return;
    if(typeof args == 'string') {
        this.doFun(this.kv.get(args));
    } else if(_.isObject(args)) {
        for (var name in args) {
            var d = args[name];
            console.log('doFun:', d)
            if (typeof d == 'object') {
                var res ;
                if(d.fun)
                    res = this.kv.get(d.fun)(d);
                if(d.bifn && !res)
                    return;
            } else {
                console.error(name, '配置错误.');
                return;
            }
        }
    } else {
        return console.log(args,'do 参数不正确.')
    }
};


pro.parseArgs = function(args,context) {
    if(_.isString(args) && args.length>0) {
        if(args[0] === '$') {
            args = this.kv.get(args.substr(1));
        } else if(args[0] === '@') {
            args = context.get(args.substr(1));
        }
    } else if(_.isObject(args)) {
        for(var key in args) {
            args[key] = this.parseArgs(args[key],context);
        }
    } else if(_.isArray(args)) {
        for(var i = 0; i<args.length;i++) {
            args[i] = this.parseArgs(args[i],context);
        }
    }
    return args;
};

pro.runEvent = function(args,context) {
    args = this.parseArgs(args,context);
    this.doFun(args);
    /*
    if(typeof args === 'object') {
        if(this.can(args.can)) {
            this.do(args.do);
        } else {
            console.log('can return false.')
        }
    }else {
        console.error('runEvent配置错误.',args)
    }

    if(typeof args === 'string') {
        return this.runEvent(this.parseArgs(args));
    } else if(typeof args === 'object') {
        if(this.can(args.can)) {
            this.do(args.do);
        } else {
            console.log('can return false.')
        }
    }else {
        console.error('v.runEvent配置错误.')
    }
    */
};

pro.createOnFun = function(eventName) {
    var self = this;
    var fun = function() {
        self.on(eventName,function(){
            console.log('on event',eventName,arguments);
            for(var name in self.events[eventName]) {
                var e = self.events[eventName][name];
                var context = null;
                if(arguments.length === 1)
                    context = arguments[0];
                else if(arguments.length > 1)
                    context = arguments;
                context = KV(context);
                self.runEvent(e,context);
            }
        });
    };
    return fun();
};

pro.listenEvents = function(events) {
    for(var eventName in events) {
        this.events[eventName] = events[eventName];
        this.createOnFun(eventName)
        /*
        var self = this;
        this.on(eventName,function() {
            var eventName = self.curEvent;
            console.log('on event',eventName);
            for(var name in self.events[eventName]) {
                var e = self.events[eventName][name];
                self.runEvent({can: e.can, do:e.do});
            }
        });
        */
    }
};
