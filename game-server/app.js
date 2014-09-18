var pomelo = require('pomelo');
global.bearcat = require('bearcat');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
global.app = app;

var Configure = function() {
    app.set('name', 'CardGame');
    app.enable('systemMonitor');
    //app.enable('rpcDebugLog');
    global.mongoose = require("mongoose");
    //'mongodb://admin:admin@localhost/game';
    global.mongoose.connect('mongodb://localhost/game');
    app.load(require('./app/com/base'),{});
    app.load(require('./app/com/chr'),{});
    app.configure('production|development', 'connector', function() {
        app.set('connectorConfig', {
            connector: pomelo.connectors.hybridconnector,
            heartbeat: 3,
            useDict: true//,
            // useProtobuf: true
        });
    });

    app.configure('production|development', 'gate', function() {
        app.set('connectorConfig', {
            connector: pomelo.connectors.hybridconnector//,
            // useProtobuf: true
        });
    });

    app.configure('production|development', function() {
        var routeUtil = app.get('com.base').routeUtil;//bearcat.getBean('base:routeUtil');

        app.route('chat', routeUtil.chat.bind(routeUtil));
        app.filter(pomelo.timeout());
    });
    var chrMgr = app.get('com.chr');
    chrMgr.add(111,{uid:111},function(){});
};

var contextPath = require.resolve('./context.json');
bearcat.createApp([contextPath]);
//console.log(g)
bearcat.start(function() {
    Configure();
    // start app
    app.start();
});

process.on('uncaughtException', function(err) {
    console.error(' Caught exception: ' + err.stack);
});