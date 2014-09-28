/**
 * Created by feng.pan on 14-9-4.
 */

var util = require('util');
var Base = require('./base');

var Chr = function(model) {
    Base.call(this,model);
    this.updateTimmer = null;
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

pro.save = function(cb) {
    return this.model.save(cb);
};
