/**
 * Created by feng.pan on 14-9-4.
 */

var util = require('util');
var Base = require('./base');
var EventMgr = require('../../../../shared/EventMgr');
var logger = require('pomelo-logger').getLogger(__filename);

var Chr = function(model) {
    //Base.call(this,model);
    this.m = model;
    this.updateTimmer = null;
    this._powerRecoverTimmer = null;
    this._powerInitTimmer = null;
    this.ev = new EventMgr;
    this.ev.kv.set('i',this);
    this.session = null;
    this._maxValuesOfModel = {};
    this._recover = {};
    console.log('触发|初始化角色','|上下文:',null);
    var trace = '执行| '+'初始化角色';
    if(!kv.c.logic.chr.start)
        return logger.fail('请配置角色初始化逻辑文件.');
    this.ev.doFun(kv.c.logic.chr.start,trace,null);
};

util.inherits(Chr,Base);

module.exports = Chr;
var pro = Chr.prototype;

pro.setUpdateInterval = function(interval) {
    var self = this;
    if(this.updateTimmer) {
        this.clearUpdateInterval();
    }
    this.updateTimmer = setInterval(function() {
        self.save();
    },interval||500000);
};

pro.clearUpdateInterval = function() {
    clearInterval(this.updateTimmer);
    this.updateTimmer = null;
};

pro.destroy = function(cb) {
    var self = this;
    this.save(function(err) {
        if(err) {
            //
            return cb({code:500});
        }
        if(self.updateTimmer) {
            clearInterval(self.updateTimmer);
            self.updateTimmer = null;
        }
        if(self._powerRecoverTimmer) {
            clearInterval(self._powerRecoverTimmer);
            self._powerRecoverTimmer = null;
        }
        if(self._powerInitTimmer) {
            clearTimeout(self._powerInitTimmer);
            self._powerInitTimmer = null;
        }
        cb({code:200});
    })
};

pro.save = function(cb) {
    return this.m.save(cb);
};

/*
pro.getMaxPower = function() {
    return kv.sc.data.vip.maxPower[this.m.vip];
};

pro.powerRecover = function() {
    var maxPower = this.getMaxPower();
    var powerRecoverInterval = kv.data.chr.powerRecoverInterval;
    if(!this._powerRecoverTimmer) {
        var duration = new Date - this.m.offlineDate;
        var recoverNum = Math.floor(duration/powerRecoverInterval);

        if(this.m.power+recoverNum >= maxPower) {
            if(this.m.power < maxPower) {
                this.update({power:maxPower-this.m.power});
            }
        } else {
            this.update({power:recoverNum});
        }
        var self = this;
        this._powerInitTimmer = setTimeout(function() {
            if(self.m.power < maxPower) {
                self.update({power:1});
            }
            self._powerRecoverTimmer = setInterval(function() {
                if(self.m.power < maxPower) {
                    self.update({power:1});
                }
            },powerRecoverInterval);
        },powerRecoverInterval - duration%powerRecoverInterval);
    }
};
*/

/* 恢复方法，如恢复体力，法力..
opts.prop 要恢复的属性,如'power'
opts.offlineDate 上次离线时间 默认当前时间
opts.num 每次恢复多少,默认为1
opts.interval 多少时间恢复一次,默认20分钟,单位为秒
*/
pro.setRecover = function(opts) {
    if(typeof opts.prop !== 'string') {
        logger.warn('setRecover参数错误.');
        return;
    }

    if(!(opts.offlineDate instanceof Date))
        opts.offlineDate = new Date;
    if(typeof opts.num !== 'number')
        opts.num = 1;
    if(typeof opts.interval !== 'number')
        opts.interval = 20*60;

    if(this._recover[opts.prop]) {
        logger.warn(opts.prop+'重复设置恢复.');
        return;
    }
    var recover = this._recover[opts.prop] = {};
    var interval = opts.interval;
    var duration = new Date - opts.offlineDate;
    var recoverNum = Math.floor(duration/interval)*opts.num;
    var prop = this.kv.get(opts.prop);
    var offset = {};
    offset[prop] = recoverNum;
    this.op({offset:offset});
    var self = this;
    prop = this.kv.get(opts.prop);
    recover.initTimer = setTimeout(function() {
        offset[prop] += opts.num;
        self.op({offset:offset})
        recover.timer = setInterval(function() {
            offset[prop] += opts.num;
            self.op({offset:offset})
        },interval);
    },interval - duration%interval);
};

pro.setMaxValueOfModel = function(opts) {
    for(var key in opts) {
        if(typeof opts[key] != 'number') {
            logger.warn('setMaxValueOfModel失败,key:%s,value:%d',key,opts[key]);
            return false;
        }
        this._maxValuesOfModel[key] = opts[key];
    }
    return true;
};

// 有值返回值，无值返回空
pro.getMaxValueOfModel = function(key) {
    var v = this._maxValuesOfModel[key];
    if(typeof v == 'number') {
        return v;
    }
};

/* 更新model的某些属性值.偏移量可以是正数也可以是负数
 isNotity 是否通知客户端改变后的属性,默认通知
 opts是{}类型, 例如{'power':-1,{'gold':-1}} 标识m.power值减1,m.gold减一,直到最小值为0,最大值为this.maxValueOfModel['power']
 {
     insert:{} // 增 针对数组
     delete:{} // 删 针对数组
     update:{} // 改
     offset:{} // 数字型偏移,update的扩展
     isNotify:是否通知客户端改变后的属性,默认通知
 }
 */
pro.op = function(opts) {
    var needChanges = [];
    if(opts.offset) {
        for(var key in opts.offset) {
            var value = opts.offset[key]
            if(!value)
                continue;
            var k = 'i.m.'+key;
            var v = this.kv.get(k);
            if(typeof v != 'number') {
                logger.warn('偏移'+key+'值失败.值不是number类型.');
                return {code:500,key:key};
            }
            v = v+value;
            if(v<0)
                return {code:500,key:key};
            var max = this.getMaxValueOfModel(key);
            if(typeof max == 'number' && v > max)
                v = max;
            needChanges.push({key:k,value:v,op:'u'});
        }
    }
    if(opts.update) {
        for(var key in opts.update) {
            var value = opts.update[key];
            needChanges.push({key:key,value:value,op:'u'});
        }
    }
    if(opts.insert) {
        for(var key in opts.insert) {
            var value = opts.insert[key];
            needChanges.push({key:key,value:value,op:'i'});
        }
    }
    if(opts.delete) {
        // 查找看看有木有
        for(var key in opts.delete) {
            var value = opts.delete[key];
            needChanges.push({key:key,value:value,op:'d'});
        }
    }
    // 校验无误后，开始运算
    if(needChanges.length) {
        needChanges.forEach(function(data){
            if(data.op == 'u') {
                this.kv.set(data.key,data.value);
            }else if(data.op == 'i') {
                var arr = this.kv.get(data.key);
                arr.push(data.value);
            }else if(data.op == 'd'){
                var arr = this.get(data.key);
                // 以后再做。。。。
            }
        });
        if(opts.isNotity !== false) {
            this.session.send('chr.op',needChanges);
        }
    }
    return {code:200};
};


/*
pro.offsetModelProp = function(opts,isNotity) {
    // 检查是否满足
    var needChanges = {};
    for(var key in opts) {
        if(!opts[key])
            continue;
        var k = 'i.m.'+key;
        var v = this.kv.get(k);
        if(typeof v != 'number') {
            logger.warn('偏移'+key+'值失败.值不是number类型.');
            return {code:500,key:key};
        }
        v = v+opts[key];
        if(v<0)
            return {code:500,key:key};
        var max = this.getMaxValueOfModel(key);
        if(typeof max == 'number' && v > max)
            v = max;
        needChanges[k] = v;
    }
    // 偏移操作
    var changes = [];
    for(var k in needChanges) {
        var v = needChanges[k];
        this.kv.set(k,v);
        changes.push({key:k,value:v,op:'u'});
    }

    if(isNotity !== false && changes.length) {
        this.session.send('props.offset',changes);
    }
    return {code:200};
};

pro.setModelProp = function(opts,isNotity) {
    var changes = [];
    for(var key in opts) {
        var k = 'i.m.'+key;
        var v = this.kv.get(k);
    }
    if(isNotity !== false && changes.length) {
        // 这个消息不要用protobuf压缩
        this.session.send('props.set',changes);
    }
};

*/
