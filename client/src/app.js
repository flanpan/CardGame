

var LayerTemplate = cc.Layer.extend({
    _events:{},
    onEnter: function () {
        this._super();
        window.EventEmitter.call(this);
        var node = ccs.sceneReader.createNodeWithSceneFile("res/scenetest/TriggerTest/TriggerTest.json");
        this.addChild(node);
        //ccs.actionManager.playActionByName("startMenu_1.json", "Animation1");

        cc.loader.load(['src/config/scene/logo.json'], function(err, results) {
            if (err) {
                cc.log("Failed to load ", results);
                return;
            }
        });

        var data = c.scene[name];
        for(var event in data) {
            this.on()
        }



        this.schedule(this.gameLogic);
        //ccs.sendEvent(TRIGGER_EVENT_ENTERSCENE);
        this.emit('v.scene.enter');
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
        this.emit('v.scene.exit');
        this.unschedule(this.gameLogic, this);
        this._super();
    },

    onTouchBegan: function (touch, event) {
        //ccs.sendEvent(TRIGGER_EVENT_TOUCHBEGAN);
        this.emit('v.scene.touch.beban',{touch:touch,event:event});
        return true;
    },

    onTouchMoved: function (touch, event) {
        //ccs.sendEvent(TRIGGER_EVENT_TOUCHMOVED);
        this.emit('v.scene.touch.moved',{touch:touch,event:event});
    },

    onTouchEnded: function (touch, event) {
        //ccs.sendEvent(TRIGGER_EVENT_TOUCHENDED);
        this.emit('v.scene.touch.ended',{touch:touch,event:event});
    },

    onTouchCancelled: function (touch, event) {
        //ccs.sendEvent(TRIGGER_EVENT_TOUCHCANCELLED);
        this.emit('v.scene.touch.cancelled',{touch:touch,event:event});
    },

    gameLogic: function () {
        //ccs.sendEvent(TRIGGER_EVENT_UPDATESCENE);
        this.emit('v.scene.update');
    }
});

var SceneTemplate = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LayerTemplate();
        this.addChild(layer);
    }
});


var kv = {};

var m = {};
var c = {};

c.scene = {
    'c.scene.logo':'src/config/logo.json'
};

c.run = function(cb) {

    cc.director.runScene(new SceneTemplate());
};