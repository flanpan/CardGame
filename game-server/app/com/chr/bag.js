/**
 * Created by feng.pan on 14-9-28.
 */
var util = require('util');
var Base = require('./base');

var Bag = function(model) {
    Base.call(this,model);
};

util.inherits(Bag,Base);

module.exports = Bag;
var pro = Bag.prototype;