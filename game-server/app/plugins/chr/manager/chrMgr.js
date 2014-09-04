/**
 * Created by feng.pan on 14-9-4.
 */

var logger = require('pomelo-logger').getLogger(__filename);

var ChrMgr = function() {
    this.chrs = {};
    this.updateInterval = null;
};

module.exports = ChrMgr;
var pro = ChrMgr.prototype;

pro.get = function(uid) {
    return this.chrs[uid];
};

pro.add = function(uid,isCreate,cb) {

};

pro.remove = function(uid,cb) {

};

pro.removeAll = function(cb) {

};

pro.stop = function(cb) {
    this.removeAll(function() {
        logger.info('remove all chrs..');
        process.nextTick(cb);
    });
};
