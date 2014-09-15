/**
 * Created by flan on 2014/9/15.
 */
var pomelo = require('pomelo');
var bearcat = require('bearcat');

var Code = function(jsonPath) {
    var utils = bearcat.getBean('base.utils.utils');
    utils.clone(require(pomelo.app.getBase()+'/'+jsonPath),this);
};

module.exports = Code;