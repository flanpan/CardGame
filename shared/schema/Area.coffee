Schema = require ('mongoose').Schema
Area = Schema
  id: Number
  name: String
  state:
    type: String
    enum: 'free busy full'.split ' '

module.exports = Area