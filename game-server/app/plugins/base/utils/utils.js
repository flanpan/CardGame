/**
 * Created by flan on 2014/9/15.
 */
var Utils = function() {

};

var pro = Utils.prototype;

pro.invokeCallback = function(cb) {
    if(!!cb && typeof cb === 'function') {
        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    }
};

/**
 * clone an object
 */
pro.clone = function(origin,des) {
    if(!origin) {
        return;
    }
    if(!des)
        des = {};
    for(var f in origin) {
        if(origin.hasOwnProperty(f)) {
            des[f] = origin[f];
        }
    }
    return des;
};

pro.size = function(obj) {
    if(!obj) {
        return 0;
    }

    var size = 0;
    for(var f in obj) {
        if(obj.hasOwnProperty(f)) {
            size++;
        }
    }

    return size;
};

// print the file name and the line number ~ begin
function getStack(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack) {
        return stack;
    };
    var err = new Error();
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
}

function getFileName(stack) {
    return stack[1].getFileName();
}

function getLineNumber(stack){
    return stack[1].getLineNumber();
}

pro.myPrint = function() {
    if (isPrintFlag) {
        var len = arguments.length;
        if(len <= 0) {
            return;
        }
        var stack = getStack();
        var aimStr = '\'' + getFileName(stack) + '\' @' + getLineNumber(stack) + ' :\n';
        for(var i = 0; i < len; ++i) {
            aimStr += arguments[i] + ' ';
        }
        console.log('\n' + aimStr);
    }
};


module.exports = Utils;