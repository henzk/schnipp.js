/**
 * Date
 * e.g. drop down selects, radio selects or toggle buttons.
 *
 * @param {object} field_descriptor field specific part of the form schema
 * @param {object} field_data initial value for the field
 * @constructor
 * @extends schnipp.dynforms.fields.base
 **/
schnipp.dynforms.fields.datepicker = function(field_descriptor, field_data) {

    var self = schnipp.dynforms.fields.text(field_descriptor, field_data)
    
    if (field_descriptor.date_format == undefined) 
        field_descriptor.date_format = 'dd.mm.yy' 
    
    self.render_input = function() {
        self.dom.input.datepicker({ dateFormat: field_descriptor.date_format })
        return self.dom.input
    }
    return self
}

