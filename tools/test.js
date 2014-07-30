var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://112.124.70.138:27017/test');

var Thing = mongoose.model('Thing', new Schema(null, {
    strict: false
}));
var thing = new Thing({
    iAmNotInTheSchema: true
});
thing.save(); // iAmNotInTheSchema is not saved to the db

Thing.find(function(err, data) {
    console.log(err);
    console.log(data);
})
/*
// set to false..
var thingSchema = new Schema({}, {
    strict: false
});
var thing = new Thing({
    iAmNotInTheSchema: true
});
thing.save(); // iAmNotInTheSchema is now saved to the db!!

*/