/**
 *  event helpers - right now this package contains the class <tt>event_support</tt>:
 *  a helper for stuff that wants to support listeners.
 *  @namespace
 **/
schnipp.events = {}

/**
 * helper class for stuff that wants to support listeners.
 * Encapsulate this.
 * Convention: call the instance <tt>events</tt>.
 * @constructor
 **/
schnipp.events.event_support = function() {

    var self = {}

    self.cache = {}

    /**
     * register a listener for an event
     *
     * @param {string} evt name of the event to bind to
     * @param {Function} handler function that is called when the event occurs
     * @name schnipp.events.event_support#bind
     **/
    self.bind = function(evt, handler) {
        var curr_elem
        if (self.cache.hasOwnProperty(evt)) {
            curr_elem = self.cache[evt]
        } else {
            curr_elem = []
            self.cache[evt] = curr_elem
        }
        curr_elem.push(handler)
        return self
    }

    /**
     * remove a listener from an event
     *
     * @param {string} evt name of the event to unbind from
     * @param {Function} handler function to unregister
     * @name schnipp.events.event_support#unbind
     **/
    self.unbind = function(evt, handler) {
        if (self.cache[evt] == undefined) return
        var curr_elem = self.cache[evt]
        $.each(curr_elem, function(index, value) {
            if (value == handler) {
                curr_elem.splice(index, 1)
            }
        })
        return self
    }

    /**
     * fire an event with optional args
     * calls all listeners that are bound to that event
     *
     * @param {string} evt name of the event to fire
     * @param {?} args optional - arguments to pass to registered listeners
     * @name schnipp.events.event_support#fire
     **/
    self.fire = function(evt, args) {
        if (self.cache[evt] == undefined) return
        var curr_elem = self.cache[evt]
        args.evt = evt
        $.each(curr_elem, function(index, handler) {
            handler(args, evt)
        })
        return self
    }

    /**
     * fire an event - then unbind all its registered listeners
     *
     * @param {string} evt name of the event to fire
     * @param {?} args optional - arguments to pass to registered listeners
     * @name schnipp.events.event_support#fire_and_unbind
     **/
    self.fire_and_unbind = function(evt, args) {
        if (self.cache[evt] == undefined) return
        var curr_elem = self.cache[evt].slice(0)
        args.evt = evt
        $.each(curr_elem, function(index, handler) {
            handler(args, evt)
        })
        self.cache[evt] = []
        return self
    }

    self.on = self.bind
    self.off = self.unbind
    self.trigger = self.fire
    self.trigger_and_unbind = self.fire_and_unbind

    return self
}
