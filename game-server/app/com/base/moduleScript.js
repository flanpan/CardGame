/**
 * Created by feng.pan on 14-9-17.
 */
var bearcat = require('bearcat');
var logger = require('pomelo-logger').getLogger('pomelo-admin', __filename);
var vm = require('vm');
var fs = require('fs');
var util = require('util');
var path = require('path');

var Module = function(opts) {
    this.app = opts.app;
    this.root = opts.path;
    this.commands = {
        'list': list,
        'get': get,
        'save': save,
        'run': run
    };
};

module.exports = function(opts) {
    return new Module(opts);
};

module.exports.moduleId = "scripts";

Module.prototype.monitorHandler = function(agent, msg, cb) {
    var context = {
        app: this.app,
        require: require,
        os: require('os'),
        fs: require('fs'),
        process: process,
        util: util
    };
    try {
        vm.runInNewContext(msg.script, context);

        var result = context.result;
        if (!result) {
            cb(null, "script result should be assigned to result value to script module context");
        } else {
            cb(null, result);
        }
    } catch (e) {
        cb(null, e.toString());
    }

    //cb(null, vm.runInContext(msg.script, context));
};

Module.prototype.clientHandler = function(agent, msg, cb) {
    var fun = this.commands[msg.command];
    if (!fun || typeof fun !== 'function') {
        cb('unknown command:' + msg.command);
        return;
    }

    fun(this, agent, msg, cb);
};

var list = function(scriptModule, agent, msg, cb) {
    var servers = [];
    var scripts = [];
    var idMap = agent.idMap;

    for (var sid in idMap) {
        servers.push(sid);
    }

    fs.readdir(scriptModule.root, function(err, filenames) {
        if (err) {
            filenames = [];
        }
        for (var i = 0, l = filenames.length; i < l; i++) {
            scripts.push(filenames[i]);
        }

        cb(null, {
            servers: servers,
            scripts: scripts
        });
    });
};

var get = function(scriptModule, agent, msg, cb) {
    var filename = msg.filename;
    if (!filename) {
        cb('empty filename');
        return;
    }

    fs.readFile(path.join(scriptModule.root, filename), 'utf-8', function(err, data) {
        if (err) {
            logger.error('fail to read script file:' + filename + ', ' + err.stack);
            cb('fail to read script with name:' + filename);
        }

        cb(null, data);
    });
};

var save = function(scriptModule, agent, msg, cb) {
    var filepath = path.join(scriptModule.root, msg.filename);

    fs.writeFile(filepath, msg.body, function(err) {
        if (err) {
            logger.error('fail to write script file:' + msg.filename + ', ' + err.stack);
            cb('fail to write script file:' + msg.filename);
            return;
        }

        cb();
    });
};

var run = function(scriptModule, agent, msg, cb) {
    agent.request(msg.serverId, module.exports.moduleId, msg, function(err, res) {
        if (err) {
            logger.error('fail to run script for ' + err.stack);
            return;
        }
        cb(null, res);
    });
};