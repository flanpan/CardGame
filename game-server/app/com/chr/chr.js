/**
 * Created by feng.pan on 14-9-4.
 */

var util = require('util');
var Base = require('./base');
var EventMgr = require('../../../../shared/EventMgr');

var Chr = function(model) {
    Base.call(this,model);
    this.updateTimmer = null;
    this._powerRecoverTimmer = null;
    this._powerInitTimmer = null;
    this.ev = new EventMgr;
    this.ev.kv.set('i',this);
};

util.inherits(Chr,Base);

module.exports = Chr;
var pro = Chr.prototype;

pro.setUpdateInterval = function(interval) {
    var self = this;
    if(this.updateTimmer) {
        this.clearUpdateInterval();
    }
    this.updateTimmer = setInterval(function() {
        self.save();
    },interval||500000);
};

pro.clearUpdateInterval = function() {
    clearInterval(this.updateTimmer);
    this.updateTimmer = null;
};

pro.destroy = function(cb) {
    var self = this;
    this.save(function(err) {
        if(err) {
            //
            return cb({code:500});
        }
        if(self.updateTimmer) {
            clearInterval(self.updateTimmer);
            self.updateTimmer = null;
        }
        if(self._powerRecoverTimmer) {
            clearInterval(self._powerRecoverTimmer);
            self._powerRecoverTimmer = null;
        }
        if(self._powerInitTimmer) {
            clearTimeout(self._powerInitTimmer);
            self._powerInitTimmer = null;
        }
        cb({code:200});
    })
};

pro.save = function(cb) {
    return this.m.save(cb);
};

pro.getMaxPower = function() {
    return kv.sc.data.vip.maxPower[this.m.vip];
};

pro.powerRecover = function() {
    var maxPower = this.getMaxPower();
    var powerRecoverInterval = kv.data.chr.powerRecoverInterval;
    if(!this._powerRecoverTimmer) {
        var duration = new Date - this.m.offlineDate;
        var recoverNum = Math.floor(duration/powerRecoverInterval);

        if(this.m.power+recoverNum >= maxPower) {
            if(this.m.power < maxPower) {
                this.update({power:maxPower-this.m.power});
            }
        } else {
            this.update({power:recoverNum});
        }
        var self = this;
        this._powerInitTimmer = setTimeout(function() {
            if(self.m.power < maxPower) {
                self.update({power:1});
            }
            self._powerRecoverTimmer = setInterval(function() {
                if(self.m.power < maxPower) {
                    self.update({power:1});
                }
            },powerRecoverInterval);
        },powerRecoverInterval - duration%powerRecoverInterval);
    }
};