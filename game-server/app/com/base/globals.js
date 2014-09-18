/**
 * Created by flan on 2014/9/15.
 */
var globalName = "";
var Globals = function(name) {
    globalName = name;
}

Globals.prototype.init = function() {
    var clone = bearcat.getBean('com.base.utils').clone;
    global[globalName] = clone(this);
}

module.exports = Globals;