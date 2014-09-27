var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
global.app = app;


app.set('name', 'CardGame');
app.enable('systemMonitor');
//app.enable('rpcDebugLog');
global.mongoose = require("mongoose");
//'mongodb://admin:admin@localhost/game';
global.mongoose.connect('mongodb://localhost/game');
//app.load(require('./app/com/base'),{});
//app.load(require('./app/com/chr'),{});
app.configure('production|development', 'connector', function() {
    app.set('connectorConfig', {
        connector: pomelo.connectors.hybridconnector,
        heartbeat: 3,
        useDict: true,
        useProtobuf: true
    });
});

app.configure('production|development', 'gate', function() {
    app.set('connectorConfig', {
        connector: pomelo.connectors.hybridconnector,
        useProtobuf: true
    });
});

app.configure('production|development', function() {
    app.route('chat', routeUtil.chat.bind(routeUtil));
    app.filter(pomelo.timeout());
});

app.start();
process.on('uncaughtException', function(err) {
    console.error(' Caught exception: ' + err.stack);
});