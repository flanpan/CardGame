

var LayerTemplate = cc.Layer.extend({
    //event:null,
    //cfg:null,
    opts:null,
    onEnter: function () {
        this._super();
        kv.v.curScene = this;
        //this.cfg = kv.v.curSceneCfg;
        var node = ccs.sceneReader.createNodeWithSceneFile(this.opts.file);
        this.sceneNode = node;
        this.addChild(node);
        if(this.opts.onEnter) {
            this.opts.onEnter(this);
        }
        //var self = this;
        //ev.listenEvents(this.cfg.events);
        //this.schedule(this.gameLogic);
        //ccs.sendEvent(TRIGGER_EVENT_ENTERSCENE);
        //ev.emit('v.scene.enter');
        /*
        var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this)
        });
        cc.eventManager.addListener(listener1, this);*/
        //this.initSize(node);
    },
    onExit: function () {
        if(this.opts.onExit) {
            this.opts.onExit(this);
        }
        ccs.actionManager.releaseActions();
        //ccs.sendEvent(TRIGGER_EVENT_LEAVESCENE);
        //ev.emit('v.scene.exit');
        //this.unschedule(this.gameLogic, this);
        this._super();
    },
/*
    onTouchBegan: function (touch, event) {
        //ccs.sendEvent(TRIGGER_EVENT_TOUCHBEGAN);
        ev.emit('v.scene.touch.beban',{touch:touch,event:event});
        return true;
    },

    onTouchMoved: function (touch, event) {
        //ccs.sendEvent(TRIGGER_EVENT_TOUCHMOVED);
        ev.emit('v.scene.touch.moved',{touch:touch,event:event});
    },

    onTouchEnded: function (touch, event) {
        //ccs.sendEvent(TRIGGER_EVENT_TOUCHENDED);
        ev.emit('v.scene.touch.ended',{touch:touch,event:event});
    },

    onTouchCancelled: function (touch, event) {
        //ccs.sendEvent(TRIGGER_EVENT_TOUCHCANCELLED);
        ev.emit('v.scene.touch.cancelled',{touch:touch,event:event});
    },
*/
    gameLogic: function () {
        //ccs.sendEvent(TRIGGER_EVENT_UPDATESCENE);
        //ev.emit('v.scene.update');
    }
});

var SceneTemplate = cc.Scene.extend({
    ctor:function(opts) {
        this._super();
        this.opts = opts;
    },
    onEnter:function () {
        this._super();
        var layer = new LayerTemplate();
        layer.opts = this.opts;
        this.addChild(layer);
    }
});
