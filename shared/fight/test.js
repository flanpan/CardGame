/**
 * Created by feng.pan on 14-10-21.
 */

var Fight = require('./fight');

var kv = {};
kv.createFight = function(opts) {
    return new Fight(opts);
};

var opts = {
    leftFormations:[[{
        cfgId:Number,
        hp:Number,
        atk:Number,
        def:Number
    }]],
    rightFormations:[[{
        cfgId:Number,
        hp:Number,
        atk:Number,
        def:Number
    }]],
    cfg:{
        skill:require('../config/data/skill'),
        entity:require('../config/data/entity')
    }
};

var fight = kv.createFight(opts);
setInterval(function() {
    fight.update();
},1/60);