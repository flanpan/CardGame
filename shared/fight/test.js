/**
 * Created by feng.pan on 14-10-21.
 */

var Fight = require('./fight');

var fight = new Fight();
fight.init();
setInterval(function() {
    fight.update();
},1/60);