/**
 * Created by feng.pan on 14-10-21.
 */

//var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Entity = require('./entity');
var consts = require('./consts');

var Fight = function(ev) {
    //EventEmitter.call(this);
    this.entities = {};
    //this.leftEntities = {};
    //this.rightEntities = {};
    //this.ev = new EventMgr;
    this.ev = ev;
    this.ev.kv.set('fight',this);
};

//util.inherits(Fight, EventEmitter);
module.exports = Fight;

var pro = Fight.prototype;

pro.init = function() {

};

pro.left = function(entityId) {
    var x = 0;
    var e = this.entities[entityId];
    e.moveTo(Math.abs(this.x-x)/consts.speed,x);
};

pro.right = function(entityId) {
    var x = 0;
    var e = this.entities[entityId];
    e.moveTo(Math.abs(this.x-x)/consts.speed,x);
};

pro.attack = function(x,skillId,attackerId,damagerId) {

};

pro.update = function() {
    for(var id in this.entities) {
        var e = this.entities[id];
        e.update();
    };
};

