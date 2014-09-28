/**
 * Created by flan on 2014/9/27.
 */
var pomelo = require('pomelo');
module.exports = function() {
    return new Handler;
};
var Handler = function() {
    this.app = pomelo.app;
};

Handler.prototype.enter = function(msg, session, next) {
    var self = this;
    var rid = msg.rid;
    var uid = msg.username + '*' + rid
    var sessionService = self.app.get('sessionService');

    //duplicate log in
    if (!!sessionService.getByUid(uid)) {
        next(null, {
            code: 500,
            error: true
        });
        return;
    }

    session.bind(uid);
    session.set('rid', rid);
    session.push('rid', function(err) {
        if (err) {
            console.error('set rid for session service failed! error is : %j', err.stack);
        }
    });
    session.on('closed', onUserLeave.bind(null, self.app));

    //put user into channel
    self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users) {
        next(null, {
            users: users
        });
    });
};

var onUserLeave = function(app, session) {
    if (!session || !session.uid) {
        return;
    }
    app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};

