global.flan = 'hello world';
global._ = require('underscore');
global._.str = require('underscore.string');
global.http = require('http');
global.zlib = require('zlib');
global.Buffer = Buffer;

//var KV = require('../../shared/kv');
var EventMgr = require('../../shared/eventMgr');

var event = new EventMgr;
global.ev = event;
global.kv = ev.kv;
