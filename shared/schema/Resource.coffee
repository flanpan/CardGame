db = require 'mongoose'
Schema = db.Schema

Resource = Schema
  date:
    type: Date
    default: new Date
  res:[
    file: String
    date: Date
    desc: String
  ]

module.exports = Resource