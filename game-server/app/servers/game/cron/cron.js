/**
 * Created by feng.pan on 14-9-28.
 */
module.exports = function(app) {
    return new Cron(app);
};
var Cron = function(app) {
    this.app = app;
};
var pro = Cron.prototype;

pro.test = function() {
    console.log('hello cron!');
};