/**
 * Created by feng.pan on 14-10-21.
 */

var util = require('util');
var Entity = require('./entity');
var consts = require('./consts');

var Fight = function(opts) {
    this.entities = {};
    this.ev = opts.ev;
    this.ev.kv.set('fight',this);
    this.cfg = opts.cfg;
    this._init();
};

module.exports = Fight;

var pro = Fight.prototype;

pro._init = function() {

};

pro.left = function(opts) {
    var entityId = opts.entityId;
    var x = 0;
    var e = this.entities[entityId];
    e.moveTo(Math.abs(this.x-x)/consts.speed,x);
};

pro.right = function(opts) {
    var entityId = opts.entityId;
    var x = 0;
    var e = this.entities[entityId];
    e.moveTo(Math.abs(this.x-x)/consts.speed,x);
};

pro.attack = function(opts) {
    var entity = this.entities[opts.entityId];
    //var skill = this.cfg.skill[opts.skillId];
    var skillId = opts.skillId;
    var res = e.useSkill(skillId);
    // res: targetCount,damageValue
    var targets = this._getTarget(entity.id,res.targetCount);
    targets.forEach(function(target) {
        var backRes = target.damage(skillId,res.damageValue,e.element);
        entity.offset(backRes);
    });
    // x,skillId,attackerId,damagerId
};

// 获取最近的目标 返回数组
pro._getTarget = function(id,count) {

};

pro.update = function() {
    for(var id in this.entities) {
        var e = this.entities[id];
        e.update(this.entities);
    }
};

