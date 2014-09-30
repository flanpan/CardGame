/**
 * Created by flan on 2014/9/27.
 */
var pomelo = require('pomelo');

module.exports = function() {
    return new Remote;
};

var Remote = function() {
    this.app = pomelo.app;
    this.chrMgr = this.app.chrMgr;
};

var pro = Remote.prototype;


pro.add = function(args,cb) {
    if(this.chrMgr.get(args.name))
        return cb({code:code.fail});
    var self = this;
    this.chrMgr.getModel({areaId:args.areaId,name:args.name},function(res) {
        if(res.code !== 200)
            return cb({code:code.fail});
        var model = res.model;
        self.chrMgr.add(model.name,model);
        cb({code:code.ok});
    });
};

pro.remove = function(args, cb) {
    this.chrMgr.remove(args.name,cb);
};