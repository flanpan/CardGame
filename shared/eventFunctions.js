/**
 * Created by feng.pan on 14-9-30.
 */

var EventFunctions = function(eventMgr) {
    this.ev = eventMgr;
    this.kv = this.ev.kv;

    this.can = this.ev.can;
    this.do = this.ev.do;
    this.console = console;
    this.runEvent = this.ev.runEvent;
    this.createdOnNum = 0;
    this.createdEmitFunNum = 0;
};

module.exports = EventFunctions;
var pro = EventFunctions.prototype;

pro.createOn = function(args) {
    this.createdOnNum++;
    var self = this;
    return function(param) {
        self.ev.emit(args.event,param);
    };
};

pro.createEmitFun = function(args) {
    this.createdEmitFunNum++;
    var self = this;
    var fun = function(param) {
        console.log('emit '+args.event,param);
        self.ev.emit(args.event,param);
    };
    this.kv.set(args.event,fun);
};

pro.nativeFun = function(args) {
    var fun = this.kv.get(args.name);
    var res = fun.apply(args.obj,args.args)
    args.res = res;
};

pro.log = function(args) {
    console.log(args);
};