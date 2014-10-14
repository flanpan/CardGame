/**
 * Created by flan on 2014/10/11.
 */
var utils = require('./utils');
//var redis = require('redis');
var mongoose = require('mongoose');
var DEFAULT_PREFIX = 'area_1_';

var ChannelSchema = {
    channel:String,
    cid:String,
    sid:String
};

var GlobalChannelManager = function(app, opts) {
    this.app = app;
    this.opts = opts || {};
    this.prefix = opts.prefix || DEFAULT_PREFIX;
    this.host = opts.host || 'localhost';
    this.port = opts.port || 27017;
    this.db = opts.db || 'game.channel';
    //this.redis = null;
    this.mongo = null;
};

module.exports = GlobalChannelManager;

GlobalChannelManager.prototype.start = function(cb) {
    //this.redis = redis.createClient(this.port, this.host, this.opts);
    var self = this;
    this.mongo = mongoose.createConnection('mongodb://'+this.host+':'+this.port+'/'+this.db,function(err) {
        if(err) {
            console.error("[globalchannel-plugin][mongodb]" + err.stack);
        } else {
            self.model = this.mongo.model(self.prefix+'channelInfo',ChannelSchema);
        }
        utils.invokeCallback(cb, err);
    });
    /*
    if (this.opts.auth_pass) {
        this.redis.auth(this.opts.auth_pass);
    }*/
    //var self = this;

    //this.mongo.model
    /*
    this.redis.once('ready', function(err) {
        if (!!err) {
            cb(err);
        } else {
            self.redis.select(self.db, cb);
        }
    });*/
};

GlobalChannelManager.prototype.stop = function(force, cb) {
    if(this.mongo) {
        var self = this;
        this.mongo.close(function() {
            utils.invokeCallback(cb);
            self.mongo = null;
        });
    }
};

GlobalChannelManager.prototype.clean = function(cb) {
    this.model.collection.drop(function(err) {
        utils.invokeCallback(cb, err);
    });
    // 直接删除表
    /*
    var cmds = [];
    var self = this;
    this.redis.keys(genCleanKey(this), function(err, list) {
        if(!!err) {
            utils.invokeCallback(cb, err);
            return;
        }
        for(var i=0; i<list.length; i++) {
            cmds.push(['del', list[i]]);
        }
        execMultiCommands(self.redis, cmds, cb);
    });
    */
};

GlobalChannelManager.prototype.destroyChannel = function(name, cb) {
    /*
    var servers = this.app.getServers();
    var server, cmds = [];
    for(var sid in servers) {
        server = servers[sid];
        if(this.app.isFrontend(server)) {
            cmds.push(['del', genKey(this, name, sid)]);
        }
    }
    execMultiCommands(this.redis, cmds, cb);
    */
    //
    //this.model. 删除这行数据
    this.model.find({channel:name}).remove(function(err) {
        utils.invokeCallback(cb, err);
    });
};

GlobalChannelManager.prototype.add = function(name, uid, sid, cb) {
    /*
    this.redis.sadd(genKey(this, name, sid), uid, function(err) {
        utils.invokeCallback(cb, err);
    });*/

    this.model.update({name:name,uid:uid,sid:sid},{upsert:true},function(err){
        utils.invokeCallback(cb, err);
    })
};

GlobalChannelManager.prototype.leave = function(name, uid, sid, cb) {
    this.model.findOneAndRemove({name:name,uid:uid,sid:sid},function(err) {
        utils.invokeCallback(cb, err);
    });
    /*
    this.redis.srem(genKey(this, name, sid), uid, function(err) {
        utils.invokeCallback(cb, err);
    });*/
};

GlobalChannelManager.prototype.getMembersBySid = function(name, sid, cb) {
    this.model.find({name:name,sid:sid},function(err,list) {
        utils.invokeCallback(cb, err, list);
    });
    /*
    this.redis.smembers(genKey(this, name, sid), function(err, list) {
        utils.invokeCallback(cb, err, list);
    });
    */
};
/*
var execMultiCommands = function(redis, cmds, cb) {
    if(!cmds.length) {
        utils.invokeCallback(cb);
        return;
    }
    redis.multi(cmds).exec(function(err, reply) {
        utils.invokeCallback(cb, err);
    });
};

var genKey = function(self, name, sid) {
    return self.prefix + ':' + name + ':' + sid;
};

var genCleanKey = function(self) {
    return self.prefix + '*';
};
*/