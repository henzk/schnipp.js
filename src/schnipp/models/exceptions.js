

schnipp.models.exceptions = {}

/**
*   Raise this exception if an observable list does not contain
*   an object.
*/
schnipp.models.exceptions.ObjectDoesNotExist = function(msg) {
    
    var self = {}
    self.protoytpe = new Error()
    self.type = 'schnipp.models.exceptions.ObjectDoesNotExist'
    self.message = msg || 'The list you are querying does not contain an object with that id.'
    
    return self
    
}

