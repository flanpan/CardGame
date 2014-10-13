/**
 * Created by feng.pan on 14-9-28.
 */
module.exports = function() {
    return new Filter();
};

var Filter = function() {
};

var pro = Filter.prototype;

pro.before = function(msg, session, next){
    var uid = session.uid;
    if(!!uid){
        next();
    }
    else{
        next(new Error('No uid exist!'));
    }
};
