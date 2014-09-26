  var Schema = require('mongoose').Schema;
  var Area = Schema({
    id: Number,
    name: String,
    state: {
      type: String,
      "enum": 'free busy full'.split(' ')
    }
  });

module.exports = Area;
