db = require 'mongoose'
Schema = db.Schema
ObjectId = Schema.Types.ObjectId

User = Schema
  id: Number
  name: String
  password: String
  area:[
    area: ObjectId
    chr: ObjectId
  ]

module.exports = User