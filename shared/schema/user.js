var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;

var User = {
    username: String,
    password: String,
    createdDate: {type:Date,default:new Date},
    lastLoginDate:{type:Date,default:new Date},
    platform:String
};

module.exports = User;
