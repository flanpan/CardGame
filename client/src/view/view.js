/**
 * Created by flan on 2014/9/23.
 */
(function(global) {
    var ViewFunctions = function(eventMgr) {
        this.ev = eventMgr;
        this.kv = this.ev.kv;

        //this.can = this.ev.can;
        //this.do = this.ev.do;
        //this.console = console;
        //this.runEvent = this.ev.runEvent;
        //this.createdOnNum = 0;
        //this.createdEmitFunNum = 0;
    };
    global.ViewFunctions = ViewFunctions;

    var pro = ViewFunctions.prototype;

    pro._nodeByTag = function (parent, tag) {
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

    pro.getNodeByTag= function (sceneNode,tag) {
        if (sceneNode == null)
            return null;
        if (sceneNode.getTag() == tag)
            return sceneNode;
        return v._nodeByTag(sceneNode, tag);
    }

    pro.findOne = function(args) {
        var node = args.node;
        var name = args.name;
        if (!node) {
            node = kv.v.curScene.sceneNode;
        }
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
                retNode = pro.findOne({node:child, name:name});
                if (retNode)
                    break;
            }
        }
        return retNode;
    };

    pro.find = function(parent,name) {
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

    pro.mapNodes = function(args) {
        for(var name in args) {
            if(name === 'node')
                continue;
            var node = this.findOne({node:args.node,name:name});
            this.kv.set(args[name],node);
        }
    };

    pro.addListener = function(args) {
        var node = args.node;
        var eventType = args.eventType;
        var cb = args.cb;
        node.addTouchEventListener(function(sender, type) {
            if (eventType === 'began' && type === ccui.Widget.TOUCH_BEGAN
                || eventType === 'moved' && ccui.Widget.TOUCH_MOVED
                || eventType === 'ended' && ccui.Widget.TOUCH_ENDED
                || eventType === 'canceled' && ccui.Widget.TOUCH_CANCELED) {
                cb(sender);
            }
        },node);
    };

    pro.addListeners = function(args) {
        for(var nodeName in args) {
            if(nodeName === 'eventType')
                continue;
            this.addListener({node:kv.get(nodeName),eventType:args.eventType,cb:kv.get(args[nodeName])});
        }
    };

    pro.create = function(args) {
        if(args.type === 'scene') {
            return new SceneTemplate(args);
        }
    };

})(this);
