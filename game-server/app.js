var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
var app = pomelo.createApp();
var logger = require('pomelo-logger');
require('./app/init');

global.app = app;

app.set('name', 'CardGame');
app.enable('systemMonitor');
//app.registerAdmin(require('./app/module/script'), {app: app});
//app.enable('rpcDebugLog');

global.mongoose = require("mongoose");
//'mongodb://flan:flan@localhost/game';
global.mongoose.connect('mongodb://localhost/game');

app.modelMgr = {
    user:mongoose.model('user', require('../shared/schema/user')),
    chr:mongoose.model('chr', require('../shared/schema/chr'))
}
//app.load(require('./app/com/base'),{});
//app.load(require('./app/com/chr'),{});
app.configureLogger(logger);
app.configure('production|development', 'connector', function() {
    app.load(require('./app/com/chrMgr'));
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

app.configure('production|development', 'game', function() {
    app.load(require('./app/com/chrMgr'));
    app.filter(pomelo.filters.serial());
    var filter = require('./app/servers/game/filter/filter');
    app.before(filter());
});

app.configure('production|development', function() {
    app.route('chat', routeUtil.chat.bind(routeUtil));
    app.filter(pomelo.timeout());
});

app.start();
process.on('uncaughtException', function(err) {
    console.error(' Caught exception: ' + err.stack);
});