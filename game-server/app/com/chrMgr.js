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
    this.updateInterval = null;
};

var pro = ChrMgr.prototype;

pro.get = function(name) {
    return this.chrs[name];
};

pro.add = function(name,model) {
    var chr = new Chr(model);
    chr.setUpdateInterval(self.updateInterval);
    logger.info('chrMgr load chr',name);
    this.chrs[name] = chr;
};

pro.getModel = function(name,cb) {
    ChrModel.findOne({name:name},function(err,model) {
        if(err) {
            logger.warn('chrMgr find chr err:',err);
            return;
        }
        if(model) {
            return cb({code:code.ok,model:model});
        } else {
            return cb({code:code.entry.chrNotExist});
        }
    });
};

pro.createModel = function(opts,cb) {
    ChrModel.create(opts,function(err,model) {
        if(err) {
            logger.warn('chrMgr create chr err:',err);
            return;
        }
        cb({code:200,model:model});
    });
};

pro.remove = function(name,cb) {
    var chr = this.get(name);
    if(!chr) return cb({code:500});
    var self = this;
    chr.destroy(function(res) {
        delete self.chrs[name];
        cb({code:200});
    });
};

pro.removeAll = function(cb) {
    var self = this;
    async.eachSeries(Object.keys(this.chrs), function (name, callback) {
        self.remove(name,callback)
    }, function () {
        //utils.invokeCallback(cb);
        cb({code:200});
    });
};

pro.stop = function(cb) {
    this.removeAll(function() {
        logger.info('All chrs have bean removed.');
        process.nextTick(cb);
    });
};

