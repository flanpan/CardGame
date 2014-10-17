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
    magic:{type:Number,default:10},
    vip:{type:Number,default:0},
    icon:{type:Number,default:1},
    heroes:[{
        cfgId:{type:Number},
        level:{type:Number,default:1}, // 等级
        hp:Number, // 血量
        md:Number, // 魔法防御
        pd:Number, // 物理防御
        atk:Number,// 攻击力
        equip:{ // 装备
            weapon:Number,
            clothes:Number,
            shoe:Number,
            active:{
                heroCfgId:Number,
                hp:Number,//血量
                atk:Number,//攻击力
                def:Number,//物理防御力
                res:Number,// 魔法防御力
                spo:Number// 速度
            }
        }
    }],
    items:[{
        cfgId:Number,
        num:Number
    }],
    equip:[{
        cfgId:Number,
        level:Number,
        exp:Number
    }]
    //pet:Pet,
    //task:Task
};

module.exports = Chr;