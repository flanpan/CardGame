/**
 * Created by feng.pan on 14-10-21.
 */

var consts = require('./consts');
var Action = require('./action');

var Entity = function(opts) {
    this.ev = opts.ev;
    this.x = opts.x;
    this.hp = opts.maxHP;
    this.sp = 0;
    this.def = opts.def;
    this.atk = opts.atk;
    this.maxHP = opts.maxHP;
    this.maxX = opts.maxX;
    this.state = consts.state.stand;
    this.action = new Action();
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
    if(this.x>this.maxX)
        this.x = this.maxX;
};

pro.minusX = function(x) {
    if(typeof x !== 'number' || x<0)
        return;
    this.x -= x;
    if(this.x <this.minX)
        this.x = this.minX;
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

pro.update = function() {
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

pro.useSkill = function(skillId) {
    // res: targetCount,damageValue
    var res = {};
    res.targetCount = 2;
    res.damageValue = 100;
    return res;
};

pro.damage = function(skillId,damageValue,element) {
    var backRes = {}
    backRes.sp = 10;
    return backRes;
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