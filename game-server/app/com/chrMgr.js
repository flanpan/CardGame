/**
 * Created by feng.pan on 14-9-4.
 */

var logger = require('pomelo-logger').getLogger(__filename);
var mongoose = require('mongoose');
var async = require('async');
var ChrSchema = require('../../../shared/schema/chr');
var ChrModel = mongoose.model('chr', ChrSchema);
var Chr = require('./chr/chr');

module.exports = function(app, opts) {
    return new ChrMgr(app, opts);
};

var ChrMgr = function(app,opts) {
    this.name = 'chrMgr';
    app.set(this.name,this);
    this.chrs = {};
    //this.Chr = bearcat.getBean('chr.service.chr');
    //this.model = null;
    this.updateInterval = null;
};

var pro = ChrMgr.prototype;

pro.get = function(uid) {
    return this.chrs[uid];
};

pro.getFromDb = function(uid,cb) {
    var self = this;
    ChrModel.findOne({uid:uid},function(err,data) {
        if(err) {
            logger.warn('chrMgr find chr err:',err);
            return;
        }
        if(data) {
            var chr = new Chr(data);//bearcat.getBean('com.chr.chr',data);
            self.chrs[uid] = chr;
            chr.setUpdateInterval(self.updateInterval);
            logger.info('chrMgr load chr',uid);
            return cb({code:200});
        } else {

        }
    });
};

pro.create = function(opts,cb) {
    var self = this;
    ChrModel.create(opts,function(err,data) {
        if(err) {
            logger.warn('chrMgr create chr err:',err);
            return;
        }
        var chr = new Chr(data);//bearcat.getBean('com.chr.chr',data);
        self.chrs[data._id] = chr;
        chr.setUpdateInterval(self.updateInterval);
        logger.info('chrMgr create chr',uid);
        cb({code:200});
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
    var self = this;
    async.eachSeries(Object.keys(this.chrs), function (chrId, callback) {
        self.remove(chrId,callback)
    }, function () {
        //utils.invokeCallback(cb);
        cb();
    });
};

pro.stop = function(cb) {
    this.removeAll(function() {
        logger.info('All chrs have bean removed.');
        process.nextTick(cb);
    });
};

