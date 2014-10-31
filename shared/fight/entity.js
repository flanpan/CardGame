/**
 * Created by feng.pan on 14-10-21.
 */

var consts = require('./consts');
var Action = require('./action');
var formula = require('../formula');

var Entity = function(opts) {
    this.ev = opts.ev;
    this.x = opts.x;
    this.hp = opts.maxHP;
    this.sp = 0;
    this.maxSp = 100;
    this.def = opts.def;
    this.atk = opts.atk;
    this.maxHP = opts.maxHP;
    this.maxX = opts.maxX;
    this.state = consts.state.stand;
    this.action = new Action();
    this.isAutoSkill = false;
    this.attackInterval = 1000;
    this.lastUseSkillTime = new Date;
    this.cfg = opts.cfg;
    this.passiveSkillIds = [2,3];
    this.activeSkillId  = 1; //必杀技,必杀技只有一个
    this.type = opts.type;
};

module.exports = Entity;

var pro = Entity.prototype;

pro.plusHP = function(hp) {
    if(typeof hp !== 'number' || hp<0) return;
    this.hp += hp;
    if(this.hp > this.maxHP)
        this.hp = this.maxHP;
    this.emit('fight.change.hp');
};

pro.minusHP = function(hp) {
    if(typeof hp !== 'number' || hp<0) return;
    this.hp -= hp;
    if(this.hp < 0) {
        this.hp = 0;
        //this.isDead = true;
        this.setState(consts.state.dead);
    }
    this.emit('fight.change.hp');
};

pro.plusSP = function(sp) {
    if(typeof sp !== 'number' || sp < 0)
        return;
    if(this.sp == 100)
        return;
    this.sp += sp;
    if(this.sp > 100)
        this.sp = 100;
    this.emit('fight.change.sp');
};

pro.resetSP = function() {
    this.sp = 0;
    this.emit('fight.change.sp');
};

pro.plusX = function(x) {
    if(typeof x !== 'number' || x<0)
        return;
    this.x += x;
    if(this.x>this.maxX) {
        this.x = this.maxX;
        this.setState(consts.state.stand);
    }
};

pro.minusX = function(x) {
    if(typeof x !== 'number' || x<0)
        return;
    this.x -= x;
    if(this.x <this.minX) {
        this.x = this.minX;
        this.setState(consts.state.stand);
    }
};

pro.setX = function(x) {
    if(typeof x !== 'number' || x<0) return;
    this.x = x;
    if(this.x>this.maxX) {
        this.x = this.maxX;
        console.debug('坐标矫正:'+this.x);
    }
    if(this.x <this.minX) {
        this.x = this.minX;
        console.debug('坐标矫正:'+this.x);
    }
};

// duration 秒
pro.moveTo = function(duration,x,cb) {
    if(duration == 0)
        duration = 0.1;
    duration = duration*1000;
    if(this.x > x)
        this.setState(consts.state.left);
    else
        this.setState(consts.state.right);
    var self = this;
    this.action.reset(duration,consts.state.move,function() {
        self.setState(consts.state.stand);
        if(typeof cb == 'function')
            cb();
    })
};

pro.emit = function(e) {
    this.ev.invokeCb(e,this);
};

pro.setState = function(state) {
    if(this.state == state)
        return;
    this.state = state;
    this.emit('fight.change.state');
};


/*
pro.useSkill = function(skillId) {
    // res: targetCount,damageValue
    var res = {};
    res.targetCount = 2;
    res.damageValue = 100;
    return res;
};
*/

pro.setAutoSkill = function(isAuto) {
    this.isAutoSkill = isAuto;
};

pro.offset = function(opts) {
    if(opts.hp && typeof opts.hp == 'number') {
        if(opts>0) this.plusHP(opts.hp)
        else this.minusHP(opts.hp);
    }
    if(opts.sp && typeof opts.sp == 'number') {
        // 怒气值只增加或重置，不减少
        if(opts.sp>0) this.plusSP(opts.sp);
    }
    // 其他就是buf了
    /*
    if(opts.x && typeof opts.x == 'number') {
        if(opts.x>0) this.plusX(opts.x);
        else this.minusX(opts.x);
    }
    if(opts.atk && typeof opts.atk == 'number') {

    }
    if(opts.def && typeof opts.def == 'number') {

    }*/
};


pro.useActiveSkill = function(entities){
    if(this.sp == this.maxSp) {
        this.lastUseSkillTime = new Date;
        this.attack(this.activeSkillId,entities);
        return true;
    } else return false;
};

pro.getTargets = function(entities,number,targetType) {
    var arr = [];
    for(var id in entities) {
        if(targetType) {//
            if(entities[id].type != this.type && entities[id].state != consts.state.left) {
                arr.push(entities[id]);
            }
        } else { // 自己人
            if(entities[id].type == this.type) {
                arr.push(entities[id]);
            }
        }
    }
    arr.sort(function(me,target){ return Math.abs(this.x - me.x) - Math.abs(this.x- target.x) });
    var targets = []
    for(var i = 0; i<arr.length;i++) {
        if(i == number-1) break;
        targets.push(arr[i]);
    }
    return targets;
};

pro.attack = function(skillId,entities) {
    var skill = this.cfg.skill[skillId];
    var targets = this.getTargets(entities,skill.targetNum,skill.targetType);
    this.emit('fight.attack');
    this.lastUseSkillTime = new Date;
    targets.forEach(function(target) {
        target.damage(skillId,this);
    });
};

pro.damage = function(skillId,attacker) {
    var offset = formula.attack({skillId:skillId,attacker:attacker,damager:this});
    this.ev.invokeCb('fight.damage',this,attacker);
    this.offset(offset);
};

pro.getPassiveSkillId = function() {
    return 2;
};


pro.update = function(entities) {
    if(this.isAutoSkill) {
        this.useActiveSkill(entities);
        return ;
    }
    if(this.x == this.maxX && (new Date - this.lastUseSkillTime >= this.attackInterval)) {
        return this.attack(this.getPassiveSkillId(),entities);
    }
    this.action.update();
    switch(this.state) {
        case consts.state.left:
            this.minusX(this.speed);
            break;
        case consts.state.right:
            this.plusX(this.speed);
            break;
        default:
            break;
    }
};