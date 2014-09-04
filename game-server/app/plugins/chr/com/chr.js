/**
 * Created by feng.pan on 14-9-4.
 */
var bearcat = require('bearcat');

var Component = function(app,opts) {
    this.$id = 'com.chr';
    this.name = 'com.chr';
    app.set('com.chr', this);
    this.dispatcher = bearcat.getBean('base:dispatcher');
    this.routeUtil = bearcat.getBean('base:routeUtil');
};

module.exports = function(app,opts) {
    var component =  new Component(app,opts);
    return component;
};
var pro = Component.prototype;

