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

    var createAssertMgr = function(args) {
        var cb = args.cb;
        if(!cc.sys.isNative) {
            console.log('非native环境资源管理创建将被忽略.');
            return cb({code:200});
        }
        var _am = new jsb.AssetsManager(args.manifestPath, args.storagePath);
        _am.retain();
        if (!_am.getLocalManifest().isLoaded()) {
            cc.log("更新资源失败，跳过资源更新.");
            return cb({code:500});
        } else
        {
            var __failCount = 0;
            var listener = new jsb.EventListenerAssetsManager(_am, function(event) {
                switch (event.getEventCode())
                {
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                        cc.log("No local manifest file found, skip assets update.");
                        cb({code:500});
                        break;
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                        var info = {percent:event.getPercent(),percentByFile:event.getPercentByFile()}
                        var msg = event.getMessage();
                        if (msg)
                            cc.log(msg);
                        cc.log(_am._percent + "%");
                        cb({code:200,info:info});
                        break;
                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                        cc.log("Fail to download manifest file, update skipped.");
                        cb({code:500});
                        break;
                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                        cb({code:200});
                        break;
                    case jsb.EventAssetsManager.UPDATE_FINISHED:
                        cc.log("Update finished. " + event.getMessage());
                        cb({code:200});
                        break;
                    case jsb.EventAssetsManager.UPDATE_FAILED:
                        cc.log("Update failed. " + event.getMessage());
                        __failCount ++;
                        if (__failCount < 5)
                            _am.downloadFailedAssets();
                        else {
                            cc.log("Reach maximum fail count, exit update process");
                            __failCount = 0;
                            cb({code:500});
                        }
                        break;
                    case jsb.EventAssetsManager.ERROR_UPDATING:
                        cc.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
                        cb({code:500})
                        break;
                    case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                        cc.log(event.getMessage());
                        cb({code:500});
                        break;
                    default:
                        break;
                }
            });
            cc.eventManager.addListener(listener, 1);
            _am.update();
        }
        return _am;
    };

    pro.create = function(args) {
        if(args.type === 'scene') {
            // args.file
            return new SceneTemplate(args);
        } else if(args.type == 'am') {
            // manifestPath storagePath cb
            return createAssertMgr(args);
        }
    };
})(this);
