/**
 * Created by feng.pan on 14-9-29.
 */
var tokenService = require('../../../../../shared/token');
var DEFAULT_SECRET = 'pomelo_session_secret';
var DEFAULT_EXPIRE = 6 * 60 * 60 * 1000;
var User = mongoose.model('User', require('../../../../../shared/schema/user'));

module.exports = function(app) {
    return new Remote(app);
};

var Remote = function(app) {
    this.app = app;
    var session = kv.scfg.session;
    this.secret = session.secret || DEFAULT_SECRET;
    this.expire = session.expire || DEFAULT_EXPIRE;
};

var pro = Remote.prototype;

pro.auth = function(token, cb) {
    var res = tokenService.parse(token, this.secret);
    if(!res) return cb({code:code.entry.tokenError});
    if(!checkExpire(res, this.expire)) {
        return cb({code:code.entry.tokenExpire});
    }
    User.findOne({_id:res.id},function(err,user) {
        if(err) return cb({code:code.fail});
        if(!user) return cb({code:code.entry.userNotExist});
        return cb({code:200,user:user});
    });
};

var checkExpire = function(token, expire) {
    if(expire < 0) return true;
    return (Date.now() - token.timestamp) < expire;
};
