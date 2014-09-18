/**
 * Created by feng.pan on 14-9-18.
 */
/**
 * Created by feng.pan on 14-9-4.
 */

var logger = require('pomelo-logger').getLogger(__filename);
//var ChrModel = require('../schema/chrModel');
var bearcat = require('bearcat');

var ChrMgr = function(app,opts) {
    this.name = 'com.chr';
    app.set(this.name,this);
    this.chrs = {};
    this.ChrModel = bearcat.getFunction('com.chr.chrModel');
    //this.Chr = bearcat.getBean('chr.service.chr');
    //this.model = null;
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
    var ChrModel = this.ChrModel;
    ChrModel.findOne({uid:uid},function(err,data) {
        if(err) {
            logger.warn('chrMgr find chr err:',err);
            return;
        }
        if(data) {
            var chr = bearcat.getBean('com.chr.chr',data);
            self.chrs[uid] = chr;
            chr.setUpdateInterval(self.updateInterval);
            logger.info('chrMgr load chr',uid);
            return cb({code:200});
        } else {
            ChrModel.create(opts,function(err,data) {
                if(err) {
                    logger.warn('chrMgr create chr err:',err);
                    return;
                }
                var chr = bearcat.getBean('com.chr.chr',data);
                self.chrs[uid] = chr;
                chr.setUpdateInterval(self.updateInterval);
                logger.info('chrMgr create chr',uid);
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
        cb({code:200});
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

