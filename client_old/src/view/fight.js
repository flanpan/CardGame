/**
 * Created by feng.pan on 14-11-3.
 */
var LayerFight = cc.Layer.extend({
    //event:null,
    //cfg:null,
    opts:null,
    onEnter: function () {
        this._super();
        kv.v.curScene = this;
        //this.cfg = kv.v.curSceneCfg;
        var node = ccs.sceneReader.createNodeWithSceneFile(this.opts.file);
        this.model = new kv.m.fight(opts);
        //this.model.ev.on('fight.change.hp',);
        this.sceneNode = node;
        this.addChild(node);
        if(this.opts.onEnter) {
            this.opts.onEnter(this);
        }
    },
    onExit: function () {
        if(this.opts.onExit) {
            this.opts.onExit(this);
        }
        ccs.actionManager.releaseActions();
        this.unschedule(this.gameLogic, this);
        this._super();
    },
    gameLogic: function () {
    },
    onChangeHp:function(entity) {
        var entity = this.getEntity(entity.id);
        entity.setHp(entity.hp);
    }
});

var SceneFight = cc.Scene.extend({
    ctor:function(opts) {
        this._super();
        this.opts = opts;
    },
    onEnter:function () {
        this._super();
        var layer = new LayerFight();
        layer.opts = this.opts;
        this.addChild(layer);
    }
});
