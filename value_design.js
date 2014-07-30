//体力恢复时间(秒)
var recoverTime = 15 * 60;
var attackTimePerKill = 5; // 平均5回合杀死对方
var initPower = 30;
var maxStarLevel = 5;
var maxLevel = 100;
var inhibitionRatio = 1.2; // 相克系数  攻击力防御力提升1.2倍
// 元宝
// 银两
// 侠义
// 总战力
// 统帅等级 满级10
var ratio = 0.9;

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

var getValueWithStar = function(value, star) {
    return Math.floor(value * (1 + (star - 1) / (maxStarLevel - 1)));
}

var getBaseHp = function(level, star) {
    return getValueWithStar(100 + level * 20, star);
}
var getBaseAttack = function(level, star) {
    return getValueWithStar(getHp(level) / attackTimePerKill * 2, star);
}
var getBaseDefence = function(level, star) {
    return getValueWithStar(getHp(level) / attackTimePerKill, star)
}
var getBaseSpeed = function(level, star) {
    return getValueWithStar(level / 2, star);
}

// 升级所需体力 假设5星级英雄99级升100级需要5天 一天体力96+20,需要(96+20)*5=
var getUpLevelPower = function(curLevel, star) {
    return getValueWithStar(Math.pow(curLevel, 1.235), star);
}

// 升级所需经验
var getUpLevelExp = function(curLevel, star) {
    return Math.floor(Math.pow(getUpLevelPower(curLevel, star) * 30, 1.4));
}

// 杀怪获得经验
var getKillModExp = function(modLevel, star) {
    return Math.floor((getUpLevelExp(modLevel, star)) / getUpLevelPower(modLevel, star));
}

// 装备升级所需银两
var getUpLevelSilver = function(level, star) {
    return Math.floor(getUpLevelExp(level, star) * ratio);
}

// 杀怪获得银两
var getKillModSilver = function(modLevel, star) {
    return Math.floor(getKillModExp(modLevel, star) * ratio);
}

// 武器 衣服 鞋子 首饰 价值比例0.3 0.23 0.2 0.27
// 装备出售银两
var getWeaponSilver = function(level, star) {
    return Math.floor(getUpLevelSilver(level, star) * 0.3);
}
var getClothesSilver = function(level, star) {
    return Math.floor(getUpLevelSilver(level, star) * 0.23);
}
var getShoeSilver = function(level, star) {
    return Math.floor(getUpLevelSilver(level, star) * 0.2);
}
var getJewelrySilver = function(level, star) {
    return Math.floor(getUpLevelSilver(level, star) * 0.27);
}

// 获取极品装备加成后值
var getValueWithSpecielEquip = function(curStarValue, nextStarValue) {
    return Math.floor((nextStarValue - curStarValue) * 0.8);
}

// 山寨升级所需威望 
var getChrUpLevelExp = function(level) {
    return Math.floor(getUpLevelExp(level, 5) * 3);
}

for (var i = 1; i <= 100; i++) {
    /*
    console.log(i + "\t" + getUpLevelPower(i, 1) + "\t" +
        getUpLevelExp(i, 1) + "\t" + getKillModExp(i, 1) + '\t' + getChrUpLevelExp(i));
	*/
    var j = 1;
    console.log(i + '\t' + getWeaponSilver(i, j) + '\t' + getClothesSilver(i, j) + '\t' + getShoeSilver(i, j) + '\t' + getJewelrySilver(i, j) + '\t')
}