/**
 * hiddeninput field
 *
 * @param {Object} field_descriptor field specific part of the form schema
 * @param {Object} field_data initial value for the field
 * @constructor
 * @class schnipp.dynforms.fields.hiddeninput
 * @extends schnipp.dynforms.primitive_field
 **/
schnipp.dynforms.fields.hiddeninput = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.primitive_field(field_descriptor, field_data)

    self.dom.input = $(
        '<input type="hidden" name="' +
        self.field_descriptor.name +
        '" value="' + self.get_initial_data() +
        '" class="fieldtype_' + self.field_descriptor.type +
        '"/>'
    )
    
    self.super_init = self.initialize
    self.initialize = function() {
        self.super_init()
        self.dom.main.css('display', 'none')
        return self.dom.input
    }


    return self
}
