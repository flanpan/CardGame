/**
 * Created by feng.pan on 14-9-17.
 */

var bearcat = require('bearcat');
module.exports = function(app,opts) {
    return bearcat.getBean('com.base',app,opts);
    //return new Base(app,opts);
};