/**
 * Created by flan on 2014/9/27.
 */
var pomelo = require('pomelo');
module.exports = function() {
    return new Handler;
};

var createHandler = function(name) {
    return function(msg,session,next) {
        var chr = app.chrMgr.get(session.get('name'));
        if(!chr) return next(null,{code:1004});
        var context = {msg:msg,session:session,next:next};
        console.log('触发|',name,'|上下文:',context);
        var trace = '执行| '+name;
        if(!kv.c.handler.chr[name])
            return next(null,{code:1004});
        chr.ev.doFun(kv.c.handler.chr[name],trace,context);
    }
};

var Handler = function() {
    for(var handlerName in kv.c.handler.chr) {
        this[handlerName] = createHandler(handlerName);
        console.log(handlerName)
    }
};
/*
var pro = Handler.prototype;



pro.handler = function(msg,session,next) {

};

pro.buyItem = function(msg,session,next) {
    return proxy('buyItem',msg,session,next);
};

pro.sellItem = function(msg,session,next) {
    return proxy('buyItem',msg,session,next);
};

pro.sellHero = function(msg,session,next) {
    return proxy('buyItem',msg,session,next);
};

pro.useItem = function(msg,session,next) {
    return proxy('buyItem',msg,session,next);
};

pro.setName = function(msg,session,next) {
    return proxy('buyItem',msg,session,next);
};

pro.setIcon = function(msg,session,next) {
};

// 设置阵形
pro.setFormation = function(msg,session,next) {
};

pro.upgradeEquipLv = function(msg,session,next) {
};

pro.upgradeEquipStar = function(msg,session,next) {
};

pro.upgradeHeroLv = function(msg,session,next) {
};

pro.upgradeHeroStar = function(msg,session,next) {
};

pro.createHero = function(msg,session,next) {
};

pro.createItem = function(msg,session,next) {
};

pro.addFriend = function(msg,session,next) {
};

pro.removeFriend = function(msg,session,next) {
};

pro.createGroup = function(msg,session,next) {
};

pro.joinGroup = function(msg,session,next) {
};

pro.chat = function(msg,session,next) {
};

pro.fight = function(msg,session,next) {
};

pro.getProp = function(msg,session,next) {
};
*/