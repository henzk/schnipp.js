/**
 * @module schnipp.models
 **/


schnipp.models.EntityRemoter = function(urls) {
    var self = {}
    self.events = schnipp.events.event_support()
    /*override this on instance level*/
    self.urls = urls || {
        detail: '/myressource/{pk}/',
        delete: '/myressource/{pk}/delete/',
        create: '/myressource/add/',
        list: '/myressource/'
    }

    self.get_detail_url = function(pk) {
        return self.urls.detail.replace('{pk}', pk)
    }

    self.get_delete_url = function(pk) {
        return self.urls.delete.replace('{pk}', pk)
    }

    self.get_create_url = function() {
        return self.urls.create
    }

    self.get_list_url = function() {
        return self.urls.list
    }

    self.fetch_list = function(entity_list, onsuccess) {
        schnipp.net.get(
            self.get_list_url(),
            function(data) {
                if (data.status == 'success') {
                    entity_list.import_data(data.result)
                    if (onsuccess != undefined) {
                        onsuccess(self)
                    }
                    self.events.fire('post-fetch', data)
                } else {
                    self.events.fire('fetch-error', data)
                }
            },
            'json'
        )
    }

    self.fetch_one = function(observable, onsuccess) {
        schnipp.net.get(
            self.get_url(),
            function(data) {
                if (data.status == 'success') {
                    self.clear()
                    self.set_raw(data.result)
                    if (onsuccess != undefined) {
                        onsuccess(self)
                    }
                    self.events.fire('post-fetch', {})
                } else {
                    console.log(data.status, data.msg)
                }
            },
            'json'
        )
    }

    self.save = function(observable, onsuccess) {}

    self.create = function(observable, onsuccess) {}

    self.delete = function(observable, onsuccess) {}

    return self
}

schnipp.models.EntityList = function(list_url) {
    var self = schnipp.models.object_list()

    self.remote = schnipp.models.EntityRemoter({
        list: list_url
    })

    self.fetch_list = function(onsuccess) {
        self.remote.fetch_list(self, onsuccess)
    }

    return self
}

/**
 * An Entity is an observable that supports syncing data with a server
 *
 * @class schnipp.models.entity
 * @constructor
 * @extends schnipp.models.observable
 * @param {Object} attrs observed data.
 **/
schnipp.models.Entity = function(name, parent, attrs) {
    var self = schnipp.models.observable(attrs)
    self.parent = parent
    self.entity_type = name

    self.get_url = function() {return self.parent.get_url()}
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
        schnipp.net.get(
            self.get_url(),
            function(data) {
                if (data.status == 'success') {
                    self.clear()
                    self.set_raw(data.result)
                    if (onsuccess != undefined) {
                        onsuccess(self)
                    }
                    self.events.fire('post-fetch', {})
                } else {
                    console.log(data.status, data.msg)
                }
            },
            'json'
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

