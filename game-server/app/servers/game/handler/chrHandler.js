/**
 * Created by flan on 2014/9/27.
 */
var pomelo = require('pomelo');
module.exports = function() {
    return new Handler;
};
var Handler = function() {
    this.app = pomelo.app;
};

var pro = Handler.prototype;

pro.test = function(msg,session,next) {
    next(null,'helloWorld');
}