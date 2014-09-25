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
    require('src/lib/async.js');
    require('src/lib/underscore.js');
    require('src/lib/underscore.string.js');
}

var fcc = {};

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

    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        loadCfg(function() {
            for(var key in kv.c.scene) {
                var scene = kv.c.scene[key];
                if(scene.isFirst) {
                    kv.set('v.curSceneCfg',scene);
                    break;
                }
            }
            if(!kv.v.curSceneCfg) {
                return console.err('没有设定第一个场景.')
            }




            cc.unzip4base64('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'
                ,function(err,str){
                    cc.log("------");
                    cc.log("------"+str);
                    var obj = JSON.parse(str);
                    cc.log("obj = " + JSON.stringify(obj));
                console.log(err,JSON.parse(str));
                cc.director.runScene(new SceneTemplate());
            })
            //cc.Codec.Base64.decodeAsArray(nodeValue, 4);


        });
    }, this);
};
cc.game.run();