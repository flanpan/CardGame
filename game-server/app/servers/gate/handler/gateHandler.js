var pomelo = require('pomelo');
var dispatcher = require('../../../util/dispatcher')
module.exports = function() {
    return new GateHandler();
};

var GateHandler = function() {
	this.app = pomelo.app;
};

/**
 * Gate handler that dispatch user to connectors.
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param {Function} next next stemp callback
 *
 */
GateHandler.prototype.queryEntry = function(msg, session, next) {
	var uid = msg.uid;
	if (!uid) {
		next(null, {
			code: 500
		});
		return;
	}
	// get all connectors
	var connectors = this.app.getServersByType('connector');
	if (!connectors || connectors.length === 0) {
		next(null, {
			code: 500
		});
		return;
	}
	// select connector
	var res = dispatcher.dispatch(uid, connectors);
	next(null, {
		code: 200,
		host: res.host,
		port: res.clientPort
	});
};

