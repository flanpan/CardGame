/**
 * Created by flan on 2014/10/6.
 */


var _proto = cc.Node.prototype;
_proto.f = {};
cc.defineGetterSetter(_proto.f, "addChild", null, _proto.setTag);