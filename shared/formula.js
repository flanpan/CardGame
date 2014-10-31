/**
 * Created by feng.pan on 14-10-21.
 */
module.exports = exp;

exp.fiveElement = {
    metal:1,
    wood:2,
    water:3,
    fire:4,
    earth:5
};

exp.prop = function(cfgId,lv,star,equip) {

};

exp.fightValue = function(cfgId,lv,star,equip) {
    var prop = exp.prop(cfgId,lv,star,equip);
    var fightValue = prop.hp + prop.atk*2 + prop.def*4;
    return fightValue;
};

// 金木水火土 12345
var isInhibition = function(a, b) { // 是否a克b ?
    if ((a == 1 && b == 2) || (a == 2 && b == 3) || (a == 3 && b == 4) || (a == 4 && b == 1) || (a == 5 && b == 3))
        return true;
    else return false;
}

var isPromotion = function(a, b) { // 是否a生b ?
    if (a == 1 && b == 3 || (a == 2 && b == 4) || (a == 3 && b == 2) || (a == 4 && b == 4) || (a == 5 && b == 1))
        return true;
    else return false;
}

// a攻击b
exp.attack = function(opts) {
    var a = opts.a;
    var b = opts.b;
    var offset = {};
    var skillId = opts.skillId;
    var inhibition_ab = isInhibition(a.element, b.element);
    var inhibition_ba = isInhibition(b.element, a.element)
    var damage = a.atk - b.def;
    if(inhibition_ab) {
        damage = Math.ceil(damage * 1.2);
    } else if(inhibition_ba) {
        damage = Math.ceil(damage * 0.8);
    }
    if(damage<1)
        damage = 1;
    b.hp = b.hp - damage;
    if(b.hp < 0)
        b.hp = 0;
    if(b.hp < damage)
        damage = damage - b.hp;
    return offset;
};


exp.getPropByPower = function(power,isFront) {
    var prop = {};
    if(isFront) {
        //hp:atk:def 70:20:10
        prop.hp = Math.ceil(power*0.7);
        prop.atk = Math.ceil(power*0.2);
        prop.def = Math.ceil(power*0.1);
    } else {
        //hp:atk:def 40:40:20
        prop.hp = Math.ceil(power*0.4);
        prop.atk = Math.ceil(power*0.4);
        prop.def = Math.ceil(power*0.2);
    }
    return prop;
};

exp.getPowerByProp = function(prop,isFront) {
    if(isFront) {

    } else {

    }
};