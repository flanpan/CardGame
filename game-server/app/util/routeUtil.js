var dispatcher = require('./dispatcher')
var exp = module.exports;

exp.chat = function(session, msg, app, cb) {
	var chatServers = app.getServersByType('chat');

	if (!chatServers || chatServers.length === 0) {
		cb(new Error('can not find chat servers.'));
		return;
	}

	var res = dispatcher.dispatch(session.get('rid'), chatServers);

	cb(null, res.id);
};

