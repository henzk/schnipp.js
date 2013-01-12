schnipp.events = {}

schnipp.events.event_support = function() {
    
    var self = {}
    
    self.cache = {}
    
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
    
    self.fire = function(evt, args) {
        if (self.cache[evt] == undefined) return
        var curr_elem = self.cache[evt]
        $.each(curr_elem, function(index, handler) {
            handler(args, evt)
        })
        return self
    }
    
    self.fire_and_unbind = function(evt, args) {
        if (self.cache[evt] == undefined) return
        var curr_elem = self.cache[evt].slice(0)
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
