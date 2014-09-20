/**
 * Created by feng.pan on 14-9-20.
 */


var Base = function(model) {

};

var pro = Base.prototype;

pro.can = function(opts) {
    console.log('can',this.db);

    return false;
};

pro.do = function(opts) {
    console.log('do');
};

module.exports = Base;