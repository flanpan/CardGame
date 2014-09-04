/**
 * Created by feng.pan on 14-9-4.
 */

var logger = require('pomelo-logger').getLogger(__filename);
var Chr = require('../schema/chr');

var ChrMgr = function() {
    this.chrs = {};
    this.updateInterval = null;
};

module.exports = ChrMgr;
var pro = ChrMgr.prototype;

pro.get = function(uid) {
    return this.chrs[uid];
};

pro.add = function(uid,opts,cb) {
    if(this.get(uid)) return cb({code:500});
    var self = this;
    Chr.find({uid:uid},function(err,data) {
        if(err) {
            ////////////
            return;
        }
        if(data) {
            self.chrs[uid] = data;
            data.setUpdateInterval(self.updateInterval);
            return cb({code:200});
        } else {
            var chr = new Chr(opts);
            chr.save(function(err,data) {
                if(err) {
                    /////////
                    return;
                }
                self.chrs[uid] = data;
                data.setUpdateInterval(self.updateInterval);
                cb({code:200});
            });
        }
    });
};

pro.remove = function(uid,cb) {
    var chr = this.get(uid);
    if(!chr) return cb({code:500});
    chr.save(function(err) {
        if(err) {
            //
            return cb({code:500});
        }
        chr.clearUpdateInterval();
        delete this.chrs[uid];
        cb({code:200})
    })
};

pro.removeAll = function(cb) {

};

pro.stop = function(cb) {
    this.removeAll(function() {
        logger.info('remove all chrs..');
        process.nextTick(cb);
    });
};

