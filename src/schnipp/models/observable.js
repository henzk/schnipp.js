schnipp.models = {}
schnipp.models.client_id_seq = 1

schnipp.models.generate_tmpid = function() {
    return 'c' + schnipp.models.client_id_seq++
}

schnipp.models.observable = function(attrs, options) {

    var self = {}
    self.options = options || {}

    self.tmpid = schnipp.models.generate_tmpid()

    self.raw_data = {}

    self.options.defaults = self.options.defaults || {}
    self.initial = attrs || {}
    self.raw_data = $.extend(self.options.defaults, self.initial)
    if (self.raw_data['id'] != undefined) {
        self.id = self.raw_data['id']
    }

    self.events = schnipp.events.event_support()

    /**
    * return value of observed attribute <attr> 
    * returns `undefined` if there is no such attribute
    */
    self.get = function(attr) {
        return self.raw_data[attr]
    }

    /**
    *   Internal set method that additionally fires the field-agnostic
    *   change events.
    */
    var _set = function(attr, value, globalevent) {
        var oldval = self.raw_data[attr]
        self.raw_data[attr] = value
        if (attr == 'id') {
            self.id = value
        }
        self.events.fire(
            'change:' + attr, 
            {
                evt: 'change:' + attr,
                src: self,
                attr: attr,
                old_value: oldval,
                new_value: value
            }
        )
        if (globalevent) {
            self.events.fire(
                'change',
                {
                    evt: 'change',
                    src: self
                }
            )
        }
    }

    self.set = function(attr, value) {
        _set(attr, value, true)
        return self
    }

    /**
    *   Updates a subset of the model's attributes.
    */
    self.update = function(kvs) {
        $.each(kvs, function(k, v) {
            _set(k, v, false)
        })
        self.events.fire(
            'change',
            {
                evt: 'change',
                src: self
            }
        )
        return self
    }

    /**
    *   Overwrites the model's raw data.
    */
    self.set_raw = function(data) {
        self.clear()
        self.update(data)
        return self
    }

    /**
    * checks if instance has an observable attribute called <attr>
    */
    self.hasattr = function(attr) {
        return (self.raw_data[attr] != undefined)
    }

    /**
    * returns the observed data as regular object
    */
    self.get_data = function() {
        return self.raw_data
    }

    /**
    * Removes observable attribute <attr>
    */
    self.unset = function(attr) {
        _set(attr, undefined)
        delete self.raw_data[attr]
        return self
    }

    /**
    * Removes all observable attributes
    */
    self.clear = function() {
        self.raw_data = {}
        self.id = undefined
        self.events.fire(
            'clear',
            {
                evt: 'change',
                src: self
            }
        )
        return self
    }

    /**
    * iterator: pass it a function(attr_name, attr_value) to iterate
    * observed attributes
    */
    self.each = function(func) {
        $.each(self.raw_data, func)
        return self
    }

    return self
}


schnipp.models.observable_list = function(options) {

    var self = {}

    self.data = []

    self.options = $.extend(
        {
            deserialize_element: function(data) {
                return schnipp.models.observable(data)
            },
            serialize_element: function(element) {
                return element.get_data()
            }
        },
        options
    )

    self.events = schnipp.events.event_support()

    /**
    *   Returns the data (list of serialized observables).
    */
    self.get_data = function() {
        var result = []
        self.each(function(index, value) {
            result.push(self.options.serialize_element(value))
        })
        return result
    }

    /**
    *   Appends a new element
    */
    self.append = function(element) {
        var el_index = self.data.length
        self.events.fire(
            'pre-insert', 
            {
                evt: 'pre-insert',
                src: self,
                index: el_index,
                element: element
            }
        )
        if (self.before_add != undefined) {
            console.log('!!!before_add is deprecated!!! please subscribe to the pre-insert event instead')
            self.before_add(element)
        }
        self.data.push(element)
        self.events.fire(
            'insert', 
            {
                evt: 'insert',
                src: self,
                index: el_index,
                element: element
            }
        )
        return self
    }
    
    /**
    *   Inserts <element> to the position specified by <index>.
    */
    self.insert = function(index, element) {
        self.events.fire(
            'pre-insert', 
            {
                evt: 'pre-insert',
                src: self,
                index: index,
                element: element
            }
        )
        if (self.before_add != undefined) {
            console.log('!!!before_add is deprecated!!! please subscribe to the pre-insert event instead')
            self.before_add(element)
        }
        self.data.splice(index, 0, element)
        self.events.fire(
            'insert', 
            {
                evt: 'insert',
                src: self,
                index: index,
                element: element
            }
        )
        // set parent when an item was inserted to a list
        element.parent = self
        return self
    }
    

    /**
    *   Returns the element at <index>.
    */
    self.get = function(index) {
        return self.data[index]
    }

    /**
    *   Returns the element specified by <id>.
    */
    self.get_by_id = function(id) {
        var elem = undefined
        self.each(function(idx, val) {
            if (val.id == id) {
                elem = val
            }
        })
        return elem
    }

    self.index_of = function(element) {
        var index = undefined
        self.each(function(idx, val) {
            if (val.id == element.id) {
                index = idx
            }
        })
        return index
    }

    /**
    *   Removes the element specified by <id>.
    */
    self.remove_by_id = function(id) {
        var index = undefined
        self.each(function(idx, val) {
            if (val.id == id) {
                index = idx
            }
        })
        return self.remove(index)
    }
    
    /**
    *   Removes the element at position <index>.
    */
    self.remove = function(index) {
        var removed = self.data[index]
        self.data.splice(index, 1)
        self.events.fire(
            'remove', 
            {
                evt: 'remove',
                src: self,
                index: index,
                element: removed
            }
        )
        
        removed.events.fire('remove',
            {
                evt: 'remove',
                src: removed,
                index: index,
                element: removed
            }
        )
        
        return removed
    }

    /**
    *   Clears the list.
    */
    self.clear = function() {
        var removed = self.data
        self.data = []
        self.events.fire(
            'clear', 
            {
                evt: 'clear',
                src: self,
                old: removed
            }
        )
    }

    self.size = function() {
        return self.data.length
    }
    
    self.each = function(func) {
        $.each(self.data, func)
        return self
    }

    return self
}
