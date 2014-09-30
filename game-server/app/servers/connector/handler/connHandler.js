//var Code = require('../../../../../shared/code');
//var userDao = require('../../../dao/userDao');
var async = require('async');
//var channelUtil = require('../../../util/channelUtil');
//var utils = require('../../../util/utils');
var logger = require('pomelo-logger').getLogger(__filename);
//var Chr = mongoose.model('Chr', require('../../../../../shared/schema/user'));

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
    this.chrMgr = app.get('chrMgr');
};

var pro = Handler.prototype;

// 一个user可以在多个取建角色，一个区只能建一个角色，角色名在世界是唯一的。
// msg: token,areaId,name
pro.createChr = function(msg,session,next) {
    var self = this;
    this.chrMgr.getModel({name:msg.name},function(res){
        if(res.code === code.ok) // 改日再完善
            return next(null,{code:res.code}); // 角色已经存在
        auth(session,msg.token,function(res) {
            if(res.code !== code.ok) {
                return next(null, {code: res.code});
            }
            var uid = res.user._id;
            self.chrMgr.getModel({areaId:msg.areaId,uid:res.user._id},function(res){
                if(res.code === code.ok) // 改日再完善
                    return next(null,{code:res.code}); // 角色已经存在
                self.chrMgr.createModel({name:msg.name,areaId:msg.areaId,uid:uid},function(res){
                    if(res.code != code.ok)
                        return next(null,{code:res.code});
                    self.entry(msg,session,next);
                });
            });
        });
    })
};

var auth = function(session,token,cb) {
    this.app.rpc.auth.authRemote.auth(session, token, cb);
};

// msg: token,areaId
pro.entry = function(msg, session, next) {
    var token = msg.token, self = this;
    if(!token) {
        next(new Error('invalid entry request: empty token'), {code: code.fail});
        return;
    }
    var uid, chr;
    async.waterfall([
        function(cb) {
            //self.app.rpc.auth.authRemote.auth(session, token, cb);
            auth(session,token,cb);
        }, function(res, cb) {
            if(res.code !== code.ok) {
                return next(null, {code: code});
            }
            uid = res.user._id;
            /*
            Chr.findOne({areaId:msg.areaId,_id:uid},function(err,chr) {
                if(err) return next(null,{code:500});
                if(!chr) return next(null,{code:code.entry.chrNotExist});
                return cb({code:code.ok,chr:chr})
            });*/
            self.chrMgr.getModel({areaId:msg.areaId,uid:uid},function(res) {
                if(res.code != code.ok)
                    return next(null,{code:res.code});
                cb({code:code.ok,chr:res.model});
            });
        }, function(res, cb) {
            chr = res.chr;
            self.app.get('sessionService').kick(uid.toObject(), cb);
        }, function(cb) {
            session.bind(uid, cb);
        }, function(cb) {
            //session.set('serverId', self.app.get('areaIdMap')[chr.areaId]);
            //session.set('playername', player.name);
            session.set('cid', chr._id);
            session.on('closed', onUserLeave.bind(null, self.app));
            session.pushAll(cb);
        }/*, function(cb) {
            self.app.rpc.chat.chatRemote.add(session, player.userId, player.name,
                channelUtil.getGlobalChannelName(), cb);
        }*/
    ], function(err) {
        if(err) return next(err, {code: code.fail});
        next(null, {code: code.ok, chr:chr});
    });
};

var onUserLeave = function (app, session, reason) {
    if(!session || !session.uid) {
        return;
    }
    /*
    utils.myPrint('1 ~ OnUserLeave is running ...');
    app.rpc.area.playerRemote.playerLeave(session, {playerId: session.get('playerId'), instanceId: session.get('instanceId')}, function(err){
        if(!!err){
            logger.error('user leave error! %j', err);
        }
    });
    app.rpc.chat.chatRemote.kick(session, session.uid, null);
    */
};
