Schema = require ('mongoose').Schema

Chr = Schema {
  name: String
  level: Number
  exp: Number
  gold: Number
  power: Number
  heros: [
    # 英雄
    id: Number
    level: Number
    exp: Number
  ]
  queue: [
    # 战队
    heroIdx: Number
    weaponIdx: Number
    chothesIdx: Number
    shoeIdx: Number
    jewelryIdx: Number
    bookAIdx: Number
    bookBIdx: Number
    bookCIdx: Number
  ]
  weapon: [
    # 武器
    id: Number
    level: Number
  ]
  clothes: [
    # 衣服
    id:  Number
    level: Number
  ]
  shoe: [
    # 鞋子
    id: Number
    level: Number
  ]
  jewelry: [
    # 首饰
    id: Number
    level: Number
  ]
#...
  item: [
    # 物品
    id: Number
    count: Number
  ]
  book: [
    # 秘籍
    id: Number
    count: Number
  ]
  star: [
    # 星魂
    id: Number
    count: Number
  ]
}

module.exports = Chr