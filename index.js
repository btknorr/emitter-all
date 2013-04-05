var Emitter = require('emitter');
var index = require('indexof');

module.exports = EmitterAll;

function EmitterAll(obj) {
    var emitter = Emitter(obj);
    var aliasOn = emitter.on;
    emitter.on = function(event, fn){
        if (typeof event === 'function') {
            (this._allCallbacks = this._allCallbacks || [])
                .push(event);
            return this;
        }
        return aliasOn(event, fn);
    };

    var aliasEmit = emitter.emit;
    emitter.emit = function(event){
        aliasEmit(arguments);
        if (this._allCallbacks) {
            var args = [].slice.call(arguments, 1);
            args.unshift(event);
            for (var i = 0, len = this._allCallbacks.length; i < len; ++i) {
                this._allCallbacks[i].apply(this, args);
            }
        }
    };

    var aliasRemoveAllListeners = emitter.removeAllListeners;
    emitter.off =
    emitter.removeListener =
    emitter.removeAllListeners = function(event, fn){
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

    var aliasListeners = emitter.listeners;
    emitter.listeners = function(event){
        if (0 == arguments.length) {
            return this._allCallbacks || [];
        }
        return aliasListeners(event);
    };

    var aliasHasListeners = emitter.hasListeners;
    emitter.hasListeners = function(event){
        if (0 == arguments.length) {
            return !! this.listeners().length;
        }
        return aliasHasListeners();
    };

    return emitter;
}