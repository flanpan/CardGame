/**
 * Created by flan on 2014/9/27.
 */
var pomelo = require('pomelo');
module.exports = function() {
    return new Handler;
};
var Handler = function() {
    this.app = pomelo.app;
};

var pro = Handler.prototype;

pro.handler = function(msg,session,next) {
    var chr = app.chrMgr.get(session.get('name'));
    if(!chr) return next(null,{code:1004});
    msg.session = session;
    msg.next = next;
    console.log('触发|',msg.req,'|上下文:',msg);
    var trace = '执行| '+msg.req;
    if(!c.handler(msg.req))
        return next(null,{code:1004});
    chr.ev.doFun(c.handler[msg.req],trace,msg);
};

pro.buyItem = function(msg,session,next) {
};

pro.sellItem = function(msg,session,next) {
};

pro.sellHero = function(msg,session,next) {
};

pro.useItem = function(msg,session,next) {
};

pro.setName = function(msg,session,next) {
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
