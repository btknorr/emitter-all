var Emitter = require('emitter');
var index = require('indexof');

var aliasOn = Emitter.prototype.on;
Emitter.prototype.on = function(event, fn){
    if (typeof event === 'function') {
        (this._allCallbacks = this._allCallbacks || [])
            .push(event);
        return this;
    }
    return aliasOn(event, fn);
};

var aliasEmit = Emitter.prototype.emit;
Emitter.prototype.emit = function(event){
    aliasEmit(event);
    if (this._allCallbacks) {
        var args = [].slice.call(arguments, 1);
        args.unshift(event);
        for (var i = 0, len = this._allCallbacks.length; i < len; ++i) {
            this._allCallbacks[i].apply(this, args);
        }
    }
};

var aliasRemoveAllListeners = Emitter.prototype.removeAllListeners;
Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
    aliasRemoveAllListeners(event, fn);
    if (this._allCallbacks) {
        // all
        if (0 == arguments.length) {
            this._allCallbacks = [];
            return this;
        }
        // remove specific handler
        var i = index(this._allCallbacks, fn._off || fn);
        if (~i) this._allCallbacks.splice(i, 1);
        return this;
    }
    return this;
};

var aliasListeners = Emitter.prototype.listeners;
Emitter.prototype.listeners = function(event){
    if (0 == arguments.length) {
        return this._allCallbacks || [];
    }
    return aliasListeners(event);
};

var aliasHasListeners = Emitter.prototype.hasListeners;
Emitter.prototype.hasListeners = function(event){
    if (0 == arguments.length) {
        return !! this.listeners().length;
    }
    return aliasHasListeners();
};
