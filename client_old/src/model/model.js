/**
 * Created by feng.pan on 14-9-23.
 */
(function () {
    var def = 'm';
    var m = {};
    //ev = new EventEmitter;

    pomelo.on('error', function(msg) {
        cc.log('error:' + msg);
        ev.emit('m.error',msg);
    });

    pomelo.on('io-error', function(event) {
        cc.log('io-error:' + event);
        ev.emit('m.io-error',event);
    });

    pomelo.on('close', function(event) {
        cc.log('ws close:' + event);
        ev.emit('close',event);
    });

    pomelo.on('heartbeat timeout', function() {
        cc.log('heartbeat timeout')
        ev.emit('m.heartbeatTimeout');
    });

    pomelo.on('onKick', function(data) {
        cc.log('onKick:' + data);
        ev.emit('m.kick',data);
    });

    m.httpReq = function(opts) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", opts.url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4)
                return;
            // 接收完成
            if(!xhr.responseText)
                return;
            var msg = JSON.parse(xhr.responseText);
            opts.cb(msg)
        };
        //"username=" + username + "&password=" + pwd
        xhr.send(opts.msg);
    };

    m.testCan = function() {
        return true;
    };

    m.testDo = function() {
        console.log('do');
    };

    m.queryEntry = function(opts) {
        pomelo.init({
            host: '127.0.0.1',
            port: 11901
        }, function() {
            pomelo.request('gate.gateHandler.queryEntry',{uid:opts.uid},function(data){
                ev.emit('m.queryEntry',data);
            })
        });
    };

    m.login = function(opts) {
        console.log('loginnnnnnnnnnnnnnn')
        opts.msg = 'username='+opts.username+'&password='+opts.password;
        opts.cb = function(data) {
            console.log(data);
            ev.emit('m.req.login',data);
        }
        m.httpReq(opts);
    };

    m.register = function(opts) {
        console.log('registerrrrrrrrrrrrrrr')
        opts.msg = 'username='+opts.username+'&password='+opts.password;
        opts.cb = function(data) {
            console.log(data);
            ev.emit('m.req.register',data);
        }
        m.httpReq(opts);
    };


    for(var key in m) {
        kv.set(def+'.'+key ,m[key]);
    }
}());