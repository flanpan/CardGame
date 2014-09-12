/**
 * Created by feng.pan on 14-9-4.
 */



var Chr = function(model) {
    this.db = model;
    this.updateTimmer = null;
};

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
    return this.db.save(cb);
};