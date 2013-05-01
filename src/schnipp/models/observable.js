
schnipp.models.client_id_seq = 1

schnipp.models.generate_tmpid = function() {
    return 'c' + schnipp.models.client_id_seq++
}

/**
 * @constructor
 * @description
 * The observable stereotype. 
 * @param {object} attrs The observable data.
 **/
schnipp.models.observable = function(attrs) {

    var self = {}
    self.tmpid = schnipp.models.generate_tmpid()
    self.raw_data = {}
    self.raw_data = $.extend(self.raw_data, attrs)
    
    if (self.raw_data['id'] != undefined) {
        self.id = self.raw_data['id']
    } else {
        self.id = self.tmpid
    }

    self.events = schnipp.events.event_support()

    /**
    * Returns the value of observed attribute <attr>.
    * Returns `undefined` if there is no such attribute.
    *
    * @param {string} attr The observerd attribute
    */
    self.get = function(attr) {
        return self.raw_data[attr]
    }
    /**
     * Internal set method that additionally fires the field-agnostic
     * change events.
     *
     * @param {string} attr The attribute to be set.
     * @param {?} value The value of the attribute
     * @param {boolean} globalevent Indicates whether to fire the instance-wide change event.
     **/
    var _set = function(attr, value, globalevent) {
        var oldval = self.raw_data[attr]
        self.raw_data[attr] = value
        if (attr == 'id') {
            self.id = value
        }
        self.events.fire('change:' + attr, {
                src: self,
                attr: attr,
                old_value: oldval,
                new_value: value
        })
        if (globalevent) {
            self.events.fire('change', {
                src: self
            })
        }
    }
    /**
     * Sets <attr> to <value>.
     *
     * @param {string} attr The attribute to be set.
     * @param {?} value The value of the attribute
     **/
    self.set = function(attr, value) {
        _set(attr, value, true)
        return self
    }
    /**
     * Updates all attributes specified in <kvs> object.
     *
     * @param {object} kvs The object with the new data.
     **/
    self.update = function(kvs) {
        $.each(kvs, function(k, v) {
            _set(k, v, false)
        })
        self.events.fire(
            'change',
            {
                //evt: 'change',
                src: self
            }
        )
        return self
    }
    /**
     * Overwrites the model's raw data.
     *
     * @param {object} data The object with the new data.
     **/
    self.set_raw = function(data) {
        self.clear()
        self.update(data)
        return self
    }
    /**
     * Checks if instance has an observable attribute called <attr>
     * @param {string} attr The attribute to be checked.
     **/
    self.hasattr = function(attr) {
        return (self.raw_data[attr] != undefined)
    }
    /**
     * Returns the observed data as regular object
     **/
    self.get_data = function() {
        return self.raw_data
    }
    /**
     * Removes observable attribute <attr>.
     * @param {string} attr The attribute to be removed.
     **/
    self.unset = function(attr) {
        _set(attr, undefined)
        delete self.raw_data[attr]
        return self
    }
    /**
     * Removes all observable attributes.
     **/
    self.clear = function() {
        self.raw_data = {}
        self.id = undefined
        self.events.fire(
            'clear',
            {
                //evt: 'change',
                src: self
            }
        )
        return self
    }
    /**
     * Iterator: pass it a function(attr_name, attr_value) to iterate observed attributes.
     * @param {function} func The visitor function.
     **/
    self.each = function(func) {
        $.each(self.raw_data, func)
        return self
    }
    return self
}


/**
 * @constructor
 * @description
 * The observable list stereotype. Takes an optional argument <modifier> which is a 
 * function to manipulate the object itself.
 * @param {modifier} func Optional - he modifier function.
 **/
schnipp.models.observable_list = function(modifier) {

    var self = {}
    self.data = []
    modifier = modifier || function(instance){}
    self.events = schnipp.events.event_support()
    /**
     * Deserializes raw data to an observable.
     * @param {object} data The the raw data.
     **/
    self.deserialize_element = function(data) {
        return schnipp.models.observable(data)
    }
    /**
     * Serializes an observable object to raw data.
     * @param {object} data The the raw data.
     **/
    self.serialize_element = function(element) {
        return element.get_data()
    }
    /**
     * Returns the data (list of serialized observables).
     **/
    self.get_data = function() {
        var result = []
        self.each(function(index, value) {
            result.push(self.serialize_element(value))
        })
        return result
    }
    /**
     * Appends a new element to the observable list.
     * @params {observable} The observable that is appended
     **/
    self.append = function(element) {
        var el_index = self.data.length
        self.insert(el_index, element)
        return self
    }
    /**
    * Inserts <element> to the position specified by <index>.
    * Fires a pre-insert and an insert event.
    * @param {integer} index The index where <element> is inserted.
    * @param {observable} element The observable that is inserted.
    */
    self.insert = function(index, element) {
        self.events.fire('pre-insert', {
            src: self,
            index: index,
            element: element
        })
        self.data.splice(index, 0, element)
        self.events.fire('insert', {
            src: self,
            index: index,
            element: element
        })
        element.parent = self
        return self
    }
    /**
     * Returns the element at <index>.
     * @param {integer} index The index of the element.
     **/
    self.get = function(index) {
        return self.data[index]
    }
    /**
     * Returns the element specified by <id>.
     * @param {integer} id The id of the element.
     **/
    self.get_by_id = function(id) {
        var elem = undefined
        self.each(function(idx, val) {
            if (val.id == id) {
                elem = val
            }
        })
        return elem
    }
    /**
     * Returns the index of <element>.
     * @param {observable} element The observable to lookup.
     **/
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
     * Removes the element specified by <id>.
     * @param {integer} id The id of the element.
     **/
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
     * Removes the element at position <index>.
     * Fires a remove event on the list and the removed item.
     * @param {integer} id The id of the element.
     **/
    self.remove = function(index) {
        var removed = self.data[index]
        self.data.splice(index, 1)
        self.events.fire('remove', {
                src: self,
                index: index,
                element: removed
        })
        removed.events.fire('remove', {
            src: removed,
            index: index,
            element: removed
        })
        return removed
    }
    /**
     * Clears the list.
     **/
    self.clear = function() {
        var removed = self.data
        self.data = []
        self.events.fire('clear', {
            src: self,
            old: removed
        })
    }
    /**
     * Returns the number of elements contained by the list.
     **/
    self.size = function() {
        return self.data.length
    }
    /**
     * Iterates the elements of the observable list.
     * @param {function} func The visitor function.
     **/
    self.each = function(func) {
        $.each(self.data, func)
        return self
    }
    // apply the modifier
    modifier(self)
    return self
}
