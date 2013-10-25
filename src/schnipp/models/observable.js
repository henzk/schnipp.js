/**
 * @module schnipp.models
 **/
schnipp.models.client_id_seq = 1

schnipp.models.generate_tmpid = function() {
    return 'c' + schnipp.models.client_id_seq++
}

/**
 * The observable stereotype
 * @class schnipp.models.observable
 * @constructor
 * @param {Object} attrs The observable data.
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
    * @param {String} attr The observed attribute
    * @return {Mixed} value of observed attribute
    * @method get
    */
    self.get = function(attr) {
        return self.raw_data[attr]
    }

    /**
     * Internal set method that additionally fires the field-agnostic
     * change events.
     *
     * @param {String} attr The attribute to be set.
     * @param {Mixed} value The new value
     * @param {Boolean} globalevent Indicates whether to fire the instance-wide change event.
     * @protected
     * @method _set
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
     * Set attribute to another value
     *
     * @param {String} attr The attribute to be set.
     * @param {Mixed} value The new value
     * @method set
     **/
    self.set = function(attr, value) {
        _set(attr, value, true)
        return self
    }

    /**
     * Updates all attributes specified in kvs object.
     *
     * @param {Object} kvs The object containing attributes and values to update
     * @method update
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
     * @param {Object} data The object with the new data.
     * @protected
     * @method set_raw
     **/
    self.set_raw = function(data) {
        self.clear()
        self.update(data)
        return self
    }

    /**
     * Checks if instance has a specific observable attribute
     * @param {String} attr The attribute to be checked for existence
     * @method hasattr
     **/
    self.hasattr = function(attr) {
        return (self.raw_data[attr] != undefined)
    }

    /**
     * Returns the observed data as regular object
     * @return {Object} containing all observed attributes and their values
     * @method get_data
     **/
    self.get_data = function() {
        return self.raw_data
    }

    /**
     * Removes observable attribute attr.
     * @param {String} attr The attribute to be removed.
     * @method unset
     **/
    self.unset = function(attr) {
        _set(attr, undefined)
        delete self.raw_data[attr]
        return self
    }

    /**
     * Removes all observed attributes
     *
     * @method clear
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
     * @param {Function} func The visitor function (should accept attr_name and attr_value)
     *
     * @method each
     **/
    self.each = function(func) {
        $.each(self.raw_data, func)
        return self
    }
    return self
}


/**
 * object_list is a list-like container that supports events to
 * notify subscribers
 *
 * elements that are placed in the list must be objects.
 * Also, elements must contain an id attribute that is unique over all
 * elements in a list.
 *
 * @constructor
 * @class schnipp.models.object_list
 **/
schnipp.models.object_list = function(modifier) {

    var self = {}
    self.data = []
    self.events = schnipp.events.event_support()

    /**
     * objects are deserialized when added to the list
     * @param {data} externally used representation of element
     * @return {Object} internally used representation of element
     * @protected
     * @method deserialize_element
     */
    self.deserialize_element = function(data) {
        return data
    }

    /**
     * objects are serialized when requested from the list
     * @param {element} internally used representation of element
     * @return {Object} externally used representation of element
     * @protected
     * @method serialize_element
     */
    self.serialize_element = function(element) {
        return element
    }

    /**
     * Returns the data (list of serialized objectss).
     * @return {Array} list of raw data of objects in this list
     * @method get_data
     **/
    self.get_data = function() {
        var result = []
        self.each(function(index, value) {
            result.push(self.serialize_element(value))
        })
        return result
    }

    /**
     * Appends a new element to the list.
     * @param {Object} element The element to append
     **/
    self.append = function(element) {
        var el_index = self.data.length
        self.insert(el_index, element)
        return self
    }

    /**
    * Inserts element to the position specified by index.
    * Fires a pre-insert and an insert event.
    * @param {integer} index The index where element is inserted.
    * @param {Object} element The element to insert.
    * @method insert
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
        return self
    }

    /**
    * Inserts element to the position specified by index.
    * Fires a set event.
    * @param {Integer} index The index of the element to update.
    * @param {Object} element The element to update.
    * @method set
    */
    self.set = function(index, value) {
        var oldval = self.data[index]
        self.data[index] = value
        self.events.fire('set', {
                src: self,
                index: index,
                old_value: oldval,
                new_value: value
        })
    }

    /**
     * Returns the element at index
     * @param {integer} index The index of the element
     * @return {Object} element at given index
     * @method get
     **/
    self.get = function(index) {
        return self.data[index]
    }

    /**
     * Returns the element specified by id.
     * @param {Integer} id the id of the element to look up
     * @return {Object} Object with given id or undefined if no element with that id can be found
     * @method get_by_id
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
     * Returns the index of element
     * @param {Mixed} element The element to get the index for
     * @return {Integer} index of given element in list or undefined if element not in list
     * @method index_of
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
     * Removes the element specified by id
     * @param {Integer} id The id of the element to remove
     * @method remove_by_id
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
     * Fires a remove event on the list.
     * @param {Integer} index index of the element to delete
     * @return {Object} element that has been removed
     * @method remove
     **/
    self.remove = function(index) {
        var removed = self.data[index]
        self.data.splice(index, 1)
        self.events.fire('remove', {
                src: self,
                index: index,
                element: removed
        })
        return removed
    }

    /**
     * Clears the list.
     * @method clear
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
     * @return {Integer} number of elements currently in list
     * @method size
     **/
    self.size = function() {
        return self.data.length
    }

    /**
     * Iterates the elements of the list.
     * @param {Function} func The visitor function.
     * @method each
     **/
    self.each = function(func) {
        $.each(self.data, func)
        return self
    }

    return self
}

/**
 * observable_list is a list-like container that supports events to
 * notify subscribers
 *
 * elements that are placed in the list must be objects.
 * Also, elements must contain an id attribute that is unique over all
 * elements in a list.
 *
 * Elements are internally represented as observables.
 *
 * @constructor
 * @class schnipp.models.observable_list
 * @superclass schnipp.models.object_list
 **/
schnipp.models.observable_list = function() {
    var self = schnipp.models.object_list()

    /**
     * Deserializes raw data to an observable.
     * @param {Object} data The the raw data.
     * @return {schnipp.models.observable} observable containing data
     * @protected
     * @method deserialize_element
     **/
    self.deserialize_element = function(data) {
        return schnipp.models.observable(data)
    }

    /**
     * Serializes an observable object to raw data.
     * @param {schnipp.models.observable} data observable element
     * @return {Object} raw data contained in observable
     * @protected
     * @method serialize_element
     **/
    self.serialize_element = function(element) {
        return element.get_data()
    }

    return self
}

schnipp.models.selectable_list_refinement = function(object_list) {
    var self = object_list

    self._selected_id = null

    self.select_element = function(element) {
        var elem = self.get_by_id(element.id)
        if (elem !== undefined) {
            var oldsel = self._selected_id
            self._selected_index = element.id
            self.events.fire('selection-changed', {
                src: self,
                index: self.index_of(elem),
                old_value: oldsel,
                new_value: self._selected_index
            })
            return true
        }
        return false
    }

    return self
}
