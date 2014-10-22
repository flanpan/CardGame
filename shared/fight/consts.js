/**
 * Created by feng.pan on 14-10-21.
 */
var exp = module.exports;

exp.state = {
    left:1,
    right:2,
    attack:3,
    stand:4,
    dead:5
};

exp.entityType = {
    our:1,
    enemy:2
};

exp.speed = 1;

exp.screen = {};
exp.screen.width = 480;

exp.formation = [[],[]]