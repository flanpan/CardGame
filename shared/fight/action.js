/**
 * Created by feng.pan on 14-10-21.
 */

var consts = require('./consts');

var Action = function() {
    this.duration = 0;
    this.callback = null;
    this.startDate = new Date;
    this.state = consts.state.stand;
};

module.exports = Action;
var pro = Action.prototype;

pro.update = function() {
    if(this.state && (new Date - this.startDate) >= this.duration) {
        this.state = consts.state.stand;
        if(typeof this.callback == 'function')
            this.callback();
        this.callback = null;
    }
};

// duration 毫秒
pro.reset = function(duration,state,cb) {
    if(!arguments.length) {
        if(typeof this.callback == 'function') {
            this.callback();
        }
        this.duration = 0;
        this.startDate = new Date;
        this.state = consts.state.stand;
        return;
    }
    if(typeof duration !== 'number' || duration <= 0 || typeof state !== 'number') return;
    if(typeof cb !== 'function') {
        if(typeof this.callback == 'function') {
            this.callback();
        }
        this.callback = null;
    } else this.callback = cb;
    this.duration = duration;
    this.startDate = new Date;
    this.state = state;
};