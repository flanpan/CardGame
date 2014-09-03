/**
 * Created by feng.pan on 14-9-3.
 */

var Component = function(app, opts) {
    this.name = 'base';
};

module.exports = function(app,opts) {
    var component =  new Component(app,opts);
    //app.set('base', component, true);
    return component;
};
var pro = Component.prototype;

