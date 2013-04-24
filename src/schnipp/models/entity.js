
schnipp.models.entity = function(parent, attrs, options) {
    var self = schnipp.models.observable(attrs, options)
    self.parent = parent
    self.get_url = function() {return self.parent.get_url() + ''}
    
    self.create_url = null
    self.get_create_url = function() {
        if (self.create_url != undefined)
            return self.create_url
        else if (self.parent)
            return self.parent.get_url()
        
    }
    
    

    /**
    *   Fetches the entity's data from the server via GET.
    */
    self.fetch = function(onsuccess) {
        $.getJSON(
            self.get_url(),
            function(data) {
                if (data.status == 'success') {
                    self.clear()
                    self.set_raw(data.result)
                    if (onsuccess != undefined) {
                        onsuccess(self)
                    }
                } else {
                    console.log(data.status, data.msg)
                }
            }
        )
    }
    
    
    /**
    *   Create a new entity.
    */
    self.save = function(onsuccess, onerror) {
        onsuccess = onsuccess || function() {}
        onerror = onerror || function() {}
    
        if (self.id == undefined) {
            drf.net.post(
                self.get_create_url(),
                self.get_data(),
                function(data) {
                    if (data.status == 'success') {
                        self.update(data.result)
                        
                        //if (self.parent != undefined) {
                        //    self.parent.append(self)
                        //}
                        
                        if (onsuccess != undefined) {
                            onsuccess(self, data)
                        } else {
                            onerror(self, data)
                        }
                    }
                }
            )
        } else {
             drf.net.put(
                self.get_url(),
                self.get_data(),
                function(data) {
                    if (data.status == 'success') {
                        if (onsuccess != undefined) {
                            onsuccess(self, data)
                        } else {
                            onerror(self, data)
                        }
                    }
                }
            )
        }
        
    }
    
    self.delete = function(onsuccess) {
        onsuccess = onsuccess || function() {}
        
        var delete_url = self.get_delete_url() || self.delete_url || self.get_url()
        
        drf.net.delete(delete_url, {}, function(data) {
            
            if (self.parent) {
                self.parent.remove(self.parent.index_of(self))
                
                //self.parent.fetch(function() {
                //    onsuccess(self, data)
                //})
            } 
            onsuccess(self, data)
            
        })
    }
    
    
    return self
}



/*

*/
schnipp.models.entity_type = function(name, modifier, options) {
    var opts = options
    return function(parent, attrs) {
        var en = schnipp.models.entity(parent, attrs, opts)
        en.entity_type = name
        modifier(en)
        return en
    }
}





/**
*   Observable list with server side synchronization.
*/
schnipp.models.entity_list = function(options) {

    var self = schnipp.models.observable_list(options)
    
    self.element_type = null
    
    // fetch url
    self.url = null
    self.get_url = function() {return self.url || self.options.url}


    /**
    *   Fetch entities from server.
    */
    self.fetch = function(onsuccess) {
        var element_type = self.element_type || self.options.element_type
        self.events.fire(
            'pre-fetch', 
            {
                evt: 'pre-fetch',
                elements: self.data
            }
        )

        $.getJSON(
            self.get_url(),
            function(data) {
                if (data.status == 'success') {
                    self.clear()
                    $.each(self.parse_raw(data.result), function(index, value) {
                        var obj = element_type(self, value)
                        self.append(obj)
                    })
                    if (onsuccess != undefined) {
                        onsuccess(self)
                    }
                    self.events.fire(
                        'post-fetch', 
                        {
                            evt: 'post-fetch',
                            elements: self.data
                        }
                    )
                } else {
                    console.log(data.status, data.msg)
                }
            }
        )
    }
    
    
    
    /**
    *   Called once for the list of items whenever new data was fetched from the server.
    */
    self.parse_raw = function(items) {
        return items
    }
    
    
    return self
}
