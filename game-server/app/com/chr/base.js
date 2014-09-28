/**
 * Created by feng.pan on 14-9-20.
 */


var Base = function(model) {
    this.model = model;
    this.updateFlags = {};
};

var pro = Base.prototype;

pro.checkNumber = function(key,value) {
    if(this.model[key] < value) {
        return false;
    }
};

pro.checkObject = function(key,value) {
    if(!this.model[key] || !this.model[key].check(value)) {
        return false;
    }
};

pro.check = function(opts) {
    for(var key in opts) {
        var value = opts[key];
        if(typeof value === 'number') {
            if(!this.checkNumber(key,value)) {
                return false;
            }
        } else if(typeof value === 'object') {
            if(!this.checkObject(key,value)) {
                return false;
            }
        } else {
            return false;
        }
    }
    return true;
};

pro.updateNumber = function(key,value) {
    if(value == 0) {
        return;
    }

    if(value > 0) {
        this.model[key] += value;
    } else {
        this.model[key] -= value;
    }

    if(!this.updateFlags[key]) {
        this.updateFlags = true;
    }

    this.emit(key+'.update',this.model[key]);
};

pro.updateObject = function(key,value) {
    this[key].update(value);
};

// 只管运算,不作判断,不返回值
pro.update = function(opts) {
    for(var key in opts) {
        var value = opts[key];
        if(typeof value === 'number') {
            return this.updateNumber(key,value);

        } else if(typeof value === 'object') {
            return this.updateObject(key,value);
        }
    }
};

pro.pullUpdates = function() {
    if(!Object.keys(this.updateFlags).length) {
        return;
    }
    var res = {};
    for(var key in this.updateFlags) {
        var value = this.updateFlags[key];
        if(typeof value == 'object') {
            var tmp = value.pullUpdates();
            if(tmp) {
                res[key] = tmp;
            }
        } else if(value == 'number') {
            res[key] = value;
        }
    }
    return res;
};

module.exports = Base;