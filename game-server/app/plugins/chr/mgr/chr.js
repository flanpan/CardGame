/**
 * Created by feng.pan on 14-9-4.
 */

var logger = require('pomelo-logger').getLogger(__filename);
//var ChrModel = require('../schema/chrModel');
var bearcat = require('bearcat');

var ChrMgr = function() {
    this.chrs = {};
    this.ChrModel = bearcat.getFunction('chr.db.chrModel');
    this.Chr = bearcat.getFunction('chr.service.chr');
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
    this.ChrModel.find({uid:uid},function(err,data) {
        if(err) {
            ////////////
            return;
        }
        if(data) {
            var chr = new self.Chr(data);
            self.chrs[uid] = chr;
            chr.setUpdateInterval(self.updateInterval);
            return cb({code:200});
        } else {
            var chr = new self.ChrModel(opts);
            chr.save(function(err,data) {
                if(err) {
                    /////////
                    return;
                }
                var chr = new self.Chr(data);
                self.chrs[uid] = chr;
                chr.setUpdateInterval(self.updateInterval);
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

