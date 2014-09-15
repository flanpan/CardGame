/**
 * Created by feng.pan on 14-9-3.
 */
var bearcat = require('bearcat');

var Component = function(app,opts) {
    this.name = 'com.base';
    app.set('com.base', this);
    this.dispatcher = bearcat.getBean('base.utils.dispatcher');
    this.routeUtil = bearcat.getBean('base.utils.routeUtil');
    this.requires = bearcat.getBean('base.utils.requires');
    this.code = bearcat.getBean('base.utils.code');
    this.utils = bearcat.getBean('base.utils.utils');
    this.globals = bearcat.getBean('base.utils.globals')
};

module.exports = function(app,opts) {
    var component =  new Component(app,opts);
    return component;
};
var pro = Component.prototype;

