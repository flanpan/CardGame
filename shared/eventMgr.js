var KV = require('./kv');
var Event = require('events').EventEmitter;
var util = require('util');

var EventMgr = function() {
    Event.call(this);
    this.events = {};
    this.kv = new KV;
};

util.inherits(EventMgr,Event);

var pro = EventMgr.prototype;
module.exports = EventMgr;

pro.emit = function(event) {
    this.curEvent = event;
    return Event.prototype.emit.call(this,event);
};
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
 */

pro.can = function(args) {
    if(!args) return true;
    if(typeof args === 'string') {
        return this.can(this.kv.get(args))
    } else if (typeof args === 'object') {
        for (var name in args) {
            var c = args[name];
            console.log('can:',name,args[name])
            if (typeof c == 'object') {
                if (!this.kv.get(name)(c))
                    return false;
            } else {
                console.error(name, '配置错误.');
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
        return v.do(this.kv.get(args));
    } else if(typeof args == 'object') {
        for (var name in args) {
            var d = args[name];
            console.log('do:',name,args[name])
            if (typeof d == 'object') {
                return this.kv.get(name)(d);
            } else {
                console.error(name, '配置错误.');
                return;
            }
        }
    } else {
        console.log(args,'do 参数不正确.')
    }
};

pro.runEvent = function(args) {
    if(typeof args === 'string') {
        return this.runEvent(this.kv.get(args));
    } else if(typeof args === 'object') {
        if(this.can(args.can)) {
            this.do(args.do);
        } else {
            console.log('can return false.')
        }
    }else {
        console.error('v.runEvent配置错误.')
    }

};

pro.listenEvents = function(events) {
    for(var eventName in events) {
        this.events[eventName] = events[eventName];
        var self = this;
        this.on(eventName,function() {
            var eventName = self.curEvent;
            console.log('on event',eventName);
            for(var name in self.events[eventName]) {
                var e = self.events[eventName][name];
                this.kv.v.runEvent({can: e.can, do:e.do});
            }
        });
    }
};