var utils = {};
utils.invokeCallback = function(cb) {
    console.log(cb);
    if (cb && typeof cb === 'function') {
        console.log('----')
        console.log(cb);
        console.log('----')
        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    } else console.log('---nonono不掉呀');
};

var cb = "";
utils.invokeCallback(cb);


var test = {
    data: {
        name: '11'
    }
};
var aaa = test.data.id || 111;
console.log(aaa);

var Class = require('./game-server/app/util/class')
var A = Class.extend({
    mem: {
        a: 11
    },
    c: function() {
        console.log('helloworld')
    },
    b: function(p) {
        console.log(this.mem)
    }
});

var B = A.extend({
    c: function() {
        console.log('hello111')
        this._super();
    },
    b: function() {
        this.mem.b = 22;
        this._super(this._super);
        this.c();
        console.log(this._super)
    }
});

var b = new B;
b.b();
console.log(b.mem);
var aaa = "haha:wwww"
console.log(aaa.split(':')[-1])



console.log(new Date().getTime())


var admin = JSON.parse("{\"admin\":{\"host\":\"localhost\",\"port\":3005,\"username\":\"monitor\",\"password\":\"monitor\"},\"菜单\":{}}"
)

var aaa = {
	admin:admin,
        root: {
            expanded: true,
            children: [{
                    id: 'systemInfo',
                    text: '系统信息',
                    leaf: true
                }, {
                    id: 'nodeInfo',
                    text: '进程信息',
                    leaf: true
                },
                // {id:'romote',text:'romote',leaf:true},
                {
                    id: 'design',
                    text: '设计',
                    expanded: false,
                    children: [{
                        id: 'jsoneditor_protocol',
                        text: '协议',
                        leaf: true
                    }, {
                        id: 'jsoneditor_cehua',
                        text: '策划',
                        leaf: true
                    }, {
                        id: 'jsoneditor_ui',
                        text: '界面',
                        leaf: true
                    }]
                }, {
                    id: 'qq',
                    text: '请求',
                    expanded: true,
                    children: [{
                        id: 'conRequest',
                        text: '连接请求',
                        leaf: true
                    }, {
                        id: 'rpcRequest',
                        text: 'Rpc请求',
                        leaf: true
                    }, {
                        id: 'forRequest',
                        text: '前台请求',
                        leaf: true
                    }]
                }, {
                    id: 'onlineUser',
                    text: '在线用户',
                    leaf: true
                }, {
                    id: 'sceneInfo',
                    text: '场景信息',
                    leaf: true
                }, {
                    id: 'scripts',
                    text: '脚本',
                    leaf: true
                }, {
                    id: 'rpcDebug',
                    text: 'RPC调试',
                    leaf: true
                }
                /*, {
				id: 'profiler',
				text: 'Profiler',
				leaf: true
			}*/
            ]
        }
		}
var fs = require('fs')
fs.writeFileSync('./test.json', JSON.stringify(aaa));		
