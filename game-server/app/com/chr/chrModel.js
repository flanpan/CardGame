/**
 * Created by feng.pan on 14-9-18.
 */
/**
 * Created by feng.pan on 14-9-4.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var Pet = require('./pet');
//var Task = require('./task');

var Chr = new Schema({
    uid:Number,
    name:String,
    level:Number,
    gold:Number,
    cash:Number,
    createdDate:Date,
    loginDate:Date
    //pet:Pet,
    //task:Task
});
var model = mongoose.model('chr', Chr);
module.exports = model;


Chr.methods.test = function() {

};

Chr.static.test1 = function() {

};
