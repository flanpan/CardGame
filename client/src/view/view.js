/**
 * Created by flan on 2014/9/23.
 */
(function () {
    var def = 'v';
    var v = {};
    v.scenes = {};
    v.curScene = null;

    v.testCan = function(args) {
        return true;
    };

    v.testDo = function(args) {
        console.log('do');
    }

    v.native = function(args) {
        //args.node[args.fun](args.args);
        var str = 'args.node.'+args.fun+'(';
        if(_.isArray(args.args)) {
            for(var i = 0; i<args.args.length;i++) {
                str += args.args[i];
                if(i != args.args.length-1) {
                    str += ','
                }
            }
        }
        str+=')';
        console.log(str);
        var res = eval(str);
        if(typeof args.return == 'string') {
            kv.set(args.return,res);
        }
    };

    v.can = function(args) {
        if(!args) return true;
        if(typeof args !== 'object') {
            console.error('can容器参数怎么不是对象.');
            return false;
        }
        for(var name in args) {
            var c = args[name];
            if(typeof c == 'string') {
                return v.can(kv.get(c))
            }else if(typeof c == 'object') {
                if(! kv.get(name)(c))
                    return false;
            } else {
                console.error(name,'配置错误.');
                return false;
            }
        }
        return true;
    };

    /*
        do里面的可选参数:{
            scene:场景节点
            node:节点
            name:节点名称
            multi:可为多个节点
        }。调用时候参数名不能用这几个名称
     */
    v.do = function(args) {

        if(!args) return;
        if(typeof args !== 'object') {
            console.error('do怎么不是对象.');
            return;
        }
        for(var name in args) {
            var d = args[name];
            if(typeof d == 'string') {
                return v.do(kv.get(d));
            }else if(typeof d == 'object') {
                if(d.node) {
                    return kv.get(name)(d);
                }
                if(d.name) {
                    if(d.scene) {
                        if(d.multi) {
                            var nodes = v.find(d.scene,d.name);
                            nodes.forEach(function(node){
                                d.node = node;
                                return kv.get(name)(d);
                            });
                        } else {
                            d.node = v.findOne(d.scene,d.name);
                            if(d.node)
                                return kv.get(name)(d);
                        }

                    } else {
                        var sceneNode = kv.v.curScene.sceneNode;
                        if(d.multi) {
                            var nodes = v.find(sceneNode,d.name);
                            nodes.forEach(function(node){
                                d.node = node;
                                return kv.get(name)(d);
                            });
                        } else {
                            d.node = v.findOne(sceneNode,d.name);
                            if(d.node)
                                return kv.get(name)(d);
                        }
                    }
                }
                return kv.get(name)(d);
            } else {
                console.error(name,'配置错误.');
                return;
            }
        }
    };

    v.runEvent = function(args) {
        if(_.isString(args)) {
            return v.runEvent(kv.get(args));
        } else if(_.isObject(args)) {
            if(v.can(args.can))
                v.do(args.do);
        }else {
            console.error('v.runEvent配置错误.')
        }

    };

    v.runEvents = function(args) {
        var scene = null;
        if(args.scene)
            scene = args.scene;
        else
            scene = kv.v.curScene;
        var events = args.events;
        for(var eventName in events) {
            console.log('on event',eventName);
            scene.event.on(eventName,function() {
                for(var name in events[eventName]) {
                    var e = events[eventName][name];
                    v.runEvent({can: e.can, do:e.do});
                }
            });
        }
    };

    v.addListener = function() {

    };

    v.sceneEvents = {};

    v.addModelListener = function(args) {
        var scene = args.scene;
        // 目测有问题
        v.sceneEvents[scene] = function(data) {
            scene.event.emit(args.key,data);
        };
        kv.m.event.on(args.key,v.sceneEvents[scene]);
    };

    v._nodeByTag = function (parent, tag) {
        if (parent == null)
            return null;
        var retNode = null;
        var children = parent.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child && child.getTag() == tag) {
                retNode = child;
                break;
            } else {
                retNode = v._nodeByTag(child, tag);
                if (retNode)
                    break;
            }
        }
        return retNode;
    }

    v.getNodeByTag= function (sceneNode,tag) {
        if (sceneNode == null)
            return null;
        if (sceneNode.getTag() == tag)
            return sceneNode;
        return v._nodeByTag(sceneNode, tag);
    }

    v.findOne = function(node,name) {
        if (node == null)
            return null;
        if(node.getName() == name)
            return node;
        var retNode = null;
        var children = node.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child && child.getName() == name) {
                retNode = child;
                break;
            } else {
                retNode = v.findOne(child, name);
                if (retNode)
                    break;
            }
        }
        return retNode;
    };

    v.find = function(parent,name) {
        var nodes = [];
        if (parent == null)
            return nodes;

        var children = parent.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child && child.getName() == name) {
                //retNode = child;
                //break;
                nodes.push(child);
            } else {
                var res = v.find(child, name);
                if(res.length) {
                    nodes = nodes.concat(res);
                }
            }
        }
        return nodes;
    };

    for(var key in v) {
        kv.set(def+'.'+key ,v[key]);
    }
}());