/**
 * Created by feng.pan on 14-9-4.
 */
var bearcat = require('bearcat');

var Component = function(app,opts) {
    this.$id = 'com.chr';
    this.name = 'com.chr';
    app.set('com.chr', this);
    return bearcat.get
};

module.exports = function(app,opts) {
    //var component =  new Component(app,opts);
   // return component;
    var com = bearcat.getBean('chr:chrMgr');
    com.name = 'com.chr';
    app.set('com.chr',com);
    return com;
};
var pro = Component.prototype;

