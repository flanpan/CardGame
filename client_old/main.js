/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */
if (cc.sys.isNative === true) {
    require('src/lib/pomelo-cocos2d-jsb/index.js');
}


var init = function() {
    kv.pomelo = pomelo;
    kv.cc = cc;
    //kv.action = action;
};

var loadCfg = function(cb) {
    cc.loader.load('src/config/index.json', function(err, results) {
        if (err) {
            cc.log("Failed to load ", results);
            return;
        }
        var files = results[0];
        cc.loader.load(files,function(err,res){
            if(err) {
                console.log(err)
            }
            for(var i = 0; i<files.length;i++) {
                var path = files[i];
                path = _.str.strLeftBack(path,'.');
                path = path.substr('src/config/'.length);
                path = path.replace(/\//g,'.');
                kv.set('c.'+path,res[i]);
            }
            cb();
        });
    });
};

cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    //var str = cc.unzipBase64('eJzT0yMAAGTvBe8=');
    //console.log(str);

    init();
    if (cc.sys.isNative === true) {
        var searchPaths = jsb.fileUtils.getSearchPaths();
        console.log(searchPaths);
        var paths = [
            //'script',
            //'src',
            'Resources'
        ];
        for (var i = 0; i < paths.length; i++) {
            searchPaths.push(paths[i]);
        }
        jsb.fileUtils.setSearchPaths(searchPaths);
    }

    cc.LoaderScene.preload(g_resources, function () {
        loadCfg(function() {
            /*
            for(var key in kv.c.scene) {
                var scene = kv.c.scene[key];
                if(scene.isFirst) {
                    kv.set('v.curSceneCfg',scene);+
                    break;
                }
            }
            if(!kv.v.curSceneCfg) {
                return console.error('没有设定第一个场景.')
            }*/
            kv.set('v.f',new ViewFunctions(ev));

            var context = {};
            context['.cb'] = kv.c.app;
            try{
            ev.doFun(context);
            kv['开始']();


            //kv.set('i.m.iconId',1);

                //ev.doFun(kv.c.app,null,{msg:{iconId:1},next:function(){console.log(arguments)},session:null});
            } catch(e) {
                console.error(e);
            }

            //cc.director.runScene(new SceneTemplate());
        });


    }, this);
};
cc.game.run();