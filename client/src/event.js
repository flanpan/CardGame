/**
 * Created by feng.pan on 14-9-24.
 */
(function () {
    var def = 'event';
    var Event = _.extend(EventEmitter);
    var pro = Event.prototype;
    pro.emit = function(event){
        this.curEvent = event; // add this flag
        this._callbacks = this._callbacks || {};
        var args = [].slice.call(arguments, 1)
            , callbacks = this._callbacks[event];

        if (callbacks) {
            callbacks = callbacks.slice(0);
            for (var i = 0, len = callbacks.length; i < len; ++i) {
                callbacks[i].apply(this, args);
            }
        }

        return this;
    };

    pro.events = {};
    pro.addEvents = function(events) {
        for(var eventName in events) {
            this.events[eventName] = events[eventName];
            var self = this;
            this.on(eventName,function() {
                var eventName = self.curEvent;
                console.log('on event',eventName);
                for(var name in self.events[eventName]) {
                    var e = self.events[eventName][name];
                    kv.v.runEvent({can: e.can, do:e.do});
                }
            });
        }
    };
    //obj._event = new EventEmitter;
    pro.get = function() {
        //return obj._event._callbacks;
    };



    kv.set(def ,new Event);
}());