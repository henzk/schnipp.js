/**
 * checkbox field
 *
 * @param {object} field_descriptor field specific part of the form schema
 * @param {object} field_data initial value for the field
 * @constructor
 * @extends schnipp.dynforms.fields.base
 **/
schnipp.dynforms.fields.checkbox = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.fields.base(field_descriptor, field_data)
    var _checked = self.field_data ? 'checked="checked"' : ''

    self.dom.input = $(
        '<input type="checkbox" name="' + 
        self.field_descriptor.name + 
        '" ' + _checked + 
        '" class="fieldtype_' + self.field_descriptor.type + 
        '"></input>'
    )

    self.get_data = function() {
        return self.dom.input.prop('checked')
    }
    
    self.set_data = function(value) {
        self.dom.input.prop('checked', value)
    }

    return self
}

