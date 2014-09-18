/**
 * Created by feng.pan on 14-9-17.
 */
var bearcat = require('bearcat');

var Base = function(app,opts) {
    this.name = 'com.base';
    app.set('com.base', this);
    this.dispatcher = bearcat.getBean('com.base.dispatcher');
    this.routeUtil = bearcat.getBean('com.base.routeUtil');
    this.requires = bearcat.getBean('com.base.requires');
    this.code = bearcat.getBean('com.base.code');
    this.utils = bearcat.getBean('com.base.utils');
    this.globals = bearcat.getBean('com.base.globals');
};
var pro = Base.prototype;

module.exports = Base;