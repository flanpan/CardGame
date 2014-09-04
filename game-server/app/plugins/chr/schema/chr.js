/**
 * Created by feng.pan on 14-9-4.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Bag = require('./bag');
var Pet = require('./pet');
var Task = require('./task');

var Chr = new Schema({
    id:Number,
    name:String,
    level:Number,
    gold:Number,
    cash:Number,
    createdDate:Date,
    loginDate:Date,
    bag:Bag//,
    //pet:Pet,
    //task:Task
});

Chr.methods.test = function() {

};

Chr.static.test1 = function() {

};

module.exports = Chr;
