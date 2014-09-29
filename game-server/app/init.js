/**
 * Created by feng.pan on 14-9-29.
 */
var path = require('path');
var KV = require('../../shared/kv');
var getCfgs = require('../../shared/getCfgs');
global.kv = new KV;


var p = path.resolve('config');
kv.set('cfg',getCfgs(p));

p = path.resolve('../shared/config');
kv.set('scfg',getCfgs(p));

global.code = kv.scfg.data.code;
global.async = require('async');
global.mongoose = require('mongoose');
global._ = require('underscore');
global._.str = require('underscore.string');