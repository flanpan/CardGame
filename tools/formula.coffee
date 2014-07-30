mongoose = require 'mongoose'
Schema = mongoose.Schema
mongoose.connect 'mongodb://112.124.70.138:27017/liangshan'
# 体力恢复时间(秒)
recoverTime = 15 * 60
attackTimePerKill = 5 # 平均5回合杀死对方
initPower = 30
maxStarLevel = 5
maxLevel = 150
inhibitionRatio = 1.2 # 相克系数  攻击力防御力提升1.2倍
# 元宝
# 银两
# 侠义
# 总战力
# 统帅等级 满级10
ratio = 0.9
# 金木水火土 12345
isInhibition = (a, b)-> # 是否a克b ?
    if (a == 1 && b == 2) || (a == 2 && b == 3) || (a == 3 && b == 4) || (a == 4 && b == 1) || (a == 5 && b == 3)
        return true
    else return false

isPromotion = (a, b)-> # 是否a生b ?
    if a == 1 && b == 3 || (a == 2 && b == 4) || (a == 3 && b == 2) || (a == 4 && b == 4) || (a == 5 && b == 1)
        return true
    else return false
getValueWithStar = (value, star)->Math.floor(value * (1 + (star - 1) / (maxStarLevel - 1)))
getHp = (level, star)->getValueWithStar 100 + level * 20, star
getAttack = (level, star)->getValueWithStar getHp(level)/attackTimePerKill*2, star
getDefence = (level, star)->getValueWithStar getHp(level)/attackTimePerKill, star
getSpeed = (level, star)->getValueWithStar level/2, star
# 升级所需体力 假设5星级英雄99级升100级需要5天 一天体力96+20,需要(96+20)*5=
getUpLevelPower = (curLevel, star)->getValueWithStar Math.pow(curLevel, 1.235), star
# 升级所需经验
getUpLevelExp = (curLevel, star)->Math.floor Math.pow(getUpLevelPower(curLevel, star) * 30, 1.4)
# 杀怪获得经验
getKillModExp = (modLevel, star)->Math.floor getUpLevelExp(modLevel, star) / getUpLevelPower(modLevel, star)
# 装备升级所需银两
getUpLevelSilver = (level, star)->Math.floor getUpLevelExp(level, star) * ratio
# 杀怪获得银两
getKillModSilver = (modLevel, star)->Math.floor getKillModExp(modLevel, star) * ratio
# 武器 衣服 鞋子 首饰 价值比例0.3 0.23 0.2 0.27
# 装备出售银两
getWeaponSilver = (level, star)->Math.floor getUpLevelSilver(level, star)*0.3
getClothesSilver = (level, star)->Math.floor getUpLevelSilver(level, star) * 0.23
getShoeSilver = (level, star)->Math.floor getUpLevelSilver(level, star) * 0.2
getJewelrySilver = (level, star)->Math.floor getUpLevelSilver(level, star) * 0.27
# 获取极品装备加成后值
getValueWithSpecielEquip = (curStarValue, nextStarValue)->Math.floor (nextStarValue - curStarValue) * 0.8
# 山寨升级所需威望 
getChrUpLevelExp = (level)->Math.floor getUpLevelExp(level, 5) * 3

for i in [1..100]
    j=1
    #console.log "#{i}\t#{getUpLevelPower i,j}\t#{getUpLevelExp i,j}\t#{getKillModExp i,j}\t#{getChrUpLevelExp i}"
    #console.log "#{i}\t#{getWeaponSilver i,j}\t#{getClothesSilver i,j}\t#{getShoeSilver i,j}\t#{getJewelrySilver i,j}"

clone = (obj)->JSON.parse JOSN.stringify obj
###
mq:{front:{'1':{}},back:{}}
back :  5 6 7 8
front:  1 2 3 4
         vs
front:  1 2 3 4
back :  5 6 7 8

fq: [{mskill:Number,mhp:Number,uskill:Number,uhp:Number}]
###
fight = (me,u)->
  fq = []
  i = 1
  while true
    if me.queue[i] and u.queue[i]
      if me.getSpeed me.queue[i] >= me.getSpeed u.front[i]
        # f = {me:{hp:0,skill:null},u:{hp:0,skill:null}}
        f = attack me.queue[i],u.queue[i]
      else f = attack u.queue
      fq.push f
    if i>4 then i=1 else i++
  fq


HeroLevelAtrr = mongoose.model 'HeroLevelAtrr',new Schema null,strict:false
ChrLevelAtrr = mongoose.model 'ChrLevelAtrr',new Schema null,strict:false
###
for i in [1..150]
  for j in [1..5]
    HeroLevelAtrr.create
      level:i
      star:j
      nextExp:getUpLevelExp(i,j)
      killModExp:getKillModExp(i,j)
  ChrLevelAtrr.create
    level:i
    nextExp:getChrUpLevelExp(i)
###

HeroLevelAtrr.find (err,data)->
  console.log err
  console.log data
