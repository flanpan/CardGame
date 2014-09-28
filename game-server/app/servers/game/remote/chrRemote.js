/**
 * Created by flan on 2014/9/27.
 */
var pomelo = require('pomelo');

module.exports = function() {
    return new Remote;
};

var Remote = function() {
    this.app = pomelo.app;
    this.channelService = this.app.get('channelService');
};

Remote.prototype.add = function(uid, sid, name, flag, cb) {
    var channel = this.channelService.getChannel(name, flag);
    var username = uid.split('*')[0];
    var param = {
        route: 'onAdd',
        user: username
    };
    channel.pushMessage(param);

    if (!!channel) {
        channel.add(uid, sid);
    }

    cb(this.get(name, flag));
};

Remote.prototype.get = function(name, flag) {
    var users = [];
    var channel = this.channelService.getChannel(name, flag);
    if (!!channel) {
        users = channel.getMembers();
    }
    for (var i = 0; i < users.length; i++) {
        users[i] = users[i].split('*')[0];
    }
    return users;
};

Remote.prototype.kick = function(uid, sid, name, cb) {
    var channel = this.channelService.getChannel(name, false);
    // leave channel
    if (!!channel) {
        channel.leave(uid, sid);
    }
    var username = uid.split('*')[0];
    var param = {
        route: 'onLeave',
        user: username
    };
    channel.pushMessage(param);
    cb();
};

