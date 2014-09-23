

var LayerTemplate = cc.Layer.extend({
    event:null,
    cfg:null,
    onEnter: function () {
        this._super();
        this.event = new EventEmitter;
        this.cfg = kv.v.curSceneCfg;
        var node = ccs.sceneReader.createNodeWithSceneFile(this.cfg.file);
        this.addChild(node);

        var checkCan = function(can) {
            if(!can) return true;
            if(typeof can !== 'object') {
                console.error('can怎么不是对象.');
                return false;
            }
            for(var name in can) {
                var c = can[name];
                if(typeof c == 'string') {
                    cc.log(name,'还没有实现.');
                    return false;
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

        var deal = function(action) {
            if(!action) return;
            if(typeof action !== 'object') {
                console.error('do怎么不是对象.');
                return;
            }
            for(var name in action) {
                var d = action[name];
                if(typeof d == 'string') {
                    console.error(name,'还没有实现.');
                    return
                }else if(typeof d == 'object') {
                    return kv.get(name)(d);
                } else {
                    console.error(name,'配置错误.');
                    return;
                }
            }
        };

        for(var eventName in this.cfg.events) {
            var self = this;
            this.event.on(eventName,function() {
                for(var name in self.cfg.events[eventName]) {
                    var e = self.cfg.events[eventName][name];
                    if(checkCan(e.can)) {
                        deal(e.do);
                    }
                }
            });
        }

        this.schedule(this.gameLogic);
        //ccs.sendEvent(TRIGGER_EVENT_ENTERSCENE);
        this.event.emit('v.scene.enter');
        var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this)
        });
        cc.eventManager.addListener(listener1, this);
        //this.initSize(node);
    },
    onExit: function () {
        ccs.actionManager.releaseActions();
        //ccs.sendEvent(TRIGGER_EVENT_LEAVESCENE);
        this.event.emit('v.scene.exit');
        this.unschedule(this.gameLogic, this);
        this._super();
    },

    onTouchBegan: function (touch, event) {
        //ccs.sendEvent(TRIGGER_EVENT_TOUCHBEGAN);
        this.event.emit('v.scene.touch.beban',{touch:touch,event:event});
        return true;
    },

    onTouchMoved: function (touch, event) {
        //ccs.sendEvent(TRIGGER_EVENT_TOUCHMOVED);
        this.event.emit('v.scene.touch.moved',{touch:touch,event:event});
    },

    onTouchEnded: function (touch, event) {
        //ccs.sendEvent(TRIGGER_EVENT_TOUCHENDED);
        this.event.emit('v.scene.touch.ended',{touch:touch,event:event});
    },

    onTouchCancelled: function (touch, event) {
        //ccs.sendEvent(TRIGGER_EVENT_TOUCHCANCELLED);
        this.event.emit('v.scene.touch.cancelled',{touch:touch,event:event});
    },

    gameLogic: function () {
        //ccs.sendEvent(TRIGGER_EVENT_UPDATESCENE);
        this.event.emit('v.scene.update');
    }
});

var SceneTemplate = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LayerTemplate();
        this.addChild(layer);
    }
});
