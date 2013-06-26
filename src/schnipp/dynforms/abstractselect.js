
/**
 * abstract select field; use it for "pick one from multiple options" scenarios like
 * e.g. drop down selects, radio selects or toggle buttons.
 *
 * @param {object} field_descriptor field specific part of the form schema
 * @param {object} field_data initial value for the field
 * @constructor
 * @extends schnipp.dynforms.fields.base
 **/
schnipp.dynforms.abstractselect = function(field_descriptor, field_data) {

    var self = schnipp.dynforms.abstract_field(field_descriptor, field_data)
    
    // defining the observable internal data structure    
    self.selected = null
    // additionally store the selected option object
    self.selected_option = null
   
    
    /**
     * get current field data
     * @returns {?} field data - the format of the data depends on the
     * field type
     * @name schnipp.dynforms.abstract_select#get_data
     **/
    self.get_data = function() {
        return self.selected
    }
    
    /**
     * set the internal data structure and additionaly set the selected option object.
     * @name schnipp.dynforms.abstract_select#_set
     **/
    self._set = function(value) {
        self.selected = value
        // set the selected_option 
        self.selected_option = self.get_option_by_value(value)
    }
    
    self.get_option_by_value = function(value) {
        var res = null
        $.each(field_descriptor.options, function(i, opt) {
            if (opt.value === value) {
                opt.index = i
                res = opt
            }
        })
        return res
    }

    
    return self
}

