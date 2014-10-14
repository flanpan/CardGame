/**
 * Created by feng.pan on 14-10-14.
 */
var merge = require('deepmerge');
var mongodb = require('mongodb');
function Cache(cfg) {
    this.config = merge({
        collection: 'cache',
        db: 'test',
        host: 'localhost',
        pass: '',
        port: 27017,
        user: 'admin',
        options: {
            db: {
                native_parser: false
            },
            server: {
                auto_reconnect: true,
                poolSize: 1,
                socketOptions: {
                    keepAlive: 120
                }
            }
        }
    }, cfg);
    this.connect();
}

var pro = Cache.prototype;

pro.connect = function(next) {
    var c, url;
    if (this.db) {
        return typeof next === "function" ? next() : void 0;
    }
    c = this.config;
    url = "mongodb://" + c.user + ":" + c.pass + "@" + c.host + ":" + c.port + "/" + c.db;
    url = url.replace(':@', '@');
    return mongodb.MongoClient.connect(url, c.options, (function(_this) {
        return function(err, database) {
            if (err) {
                return typeof next === "function" ? next(err) : void 0;
            }
            _this.db = database;
            _this.collection = _this.db.collection(c.collection);
            return typeof next === "function" ? next(err, database) : void 0;
        };
    })(this));
};

pro["delete"] = function(key, next) {
    return this.connect((function(_this) {
        return function(err) {
            if (err) {
                return next(err);
            }
            return _this.collection.remove({
                key: key
            }, {
                safe: true
            }, function(err, num_removed) {
                return next(err, null);
            });
        };
    })(this));
};

pro.get = function(key, next) {
    return this.connect((function(_this) {
        return function(err) {
            if (err) {
                return next(err);
            }
            return _this.collection.findOne({
                key: key
            }, function(err, item) {
                if (err) {
                    return next(err);
                }
                if ((item != null ? item.expires : void 0) < Date.now()) {
                    return _this["delete"](key, next);
                }
                return next(null, item != null ? item.value : void 0);
            });
        };
    })(this));
};

pro.set = function(key, value, ttl, next) {
    return this.connect((function(_this) {
        return function(err) {
            var item, options, query;
            if (err) {
                return next(err);
            }
            query = {
                key: key
            };
            item = {
                key: key,
                value: value,
                expires: Date.now() + 1000 * (ttl || 60)
            };
            options = {
                upsert: true,
                safe: true
            };
            return _this.collection.update(query, item, options, function(err) {
                return next(err, item.value);
            });
        };
    })(this));
};