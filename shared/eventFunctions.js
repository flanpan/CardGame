/**
 * Created by feng.pan on 14-9-30.
 */

var EventFunctions = function(eventMgr) {
    this.ev = eventMgr;
    this.kv = this.ev.kv;
    //this.can = this.ev.can;
    //this.do = this.ev.do;
    //this.console = console;
    //this.runEvent = this.ev.runEvent;
    //this.createdEmitFunNum = 0;
};

module.exports = EventFunctions;
var pro = EventFunctions.prototype;

pro.set = function(args) {
    if(!_.isObject(args)) {
        return console.error('set函数参数配置错误.');
    }
    for(var key in args) {
        this.kv.set(key,args[key]);
    }
};
/*
pro.createEmitFun = function(eventName) {
    var self = this;
    this.createdEmitFunNum++;
    var fun = function() {
        var a = [eventName];
        for(var i = 0; i<arguments.length;i++) {
            a.push(arguments[i]);
        }
        self.ev.emit.apply(self.ev,a);
    }
    this.kv.set(eventName,fun);
};

pro.createEmitFuns = function() {
    for(var i = 0;i<arguments.length;i++) {
        var eventName = arguments[i];
        this.createEmitFun(eventName);
    }
};
*/
pro.setTimeout = setTimeout;

pro.log = function() {
    console.log.apply(console,arguments);
};
