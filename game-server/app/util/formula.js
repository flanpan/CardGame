/**
 * Created by feng.pan on 14-10-14.
 */
module.exports = exp;

exp.chance = function(n) {
    return (Math.round(Math.random()*100)<n)
};