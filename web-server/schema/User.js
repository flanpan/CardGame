var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;

var User = Schema({
    id: Number,
    name: String,
    password: String,
    createdDate: {type:Date,default:new Date},
    lastLoginDate:{type:Date,default:new Date},
    area: [{
        id: Number,
        chrId: Schema.Types.ObjectId
    }]
});

module.exports = User;
