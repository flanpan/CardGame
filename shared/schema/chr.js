/**
 * Created by feng.pan on 14-9-18.
 */
/**
 * Created by feng.pan on 14-9-4.
 */
var mongoose = require('mongoose');
//var Schema = mongoose.Schema;
//var Pet = require('./pet');
//var Task = require('./task');

var Chr = {
    uid:String,//mongoose.Schema.Types.ObjectId,
    name:String,
    areaId:Number,
    level:{type:Number,default:1},
    gold:{type:Number,default:0},
    cash:{type:Number,default:0},
    createdDate:{type:Date,default:new Date},
    loginDate:{type:Date,default:new Date},
    offlineDate:{type:Date,default:new Date},
    power:{type:Number,default:30},
    vip:{type:Number,default:0},
    icon:{type:Number,default:1},
    heroes:[{

    }],
    items:[{

    }]
    //pet:Pet,
    //task:Task
};

module.exports = Chr;