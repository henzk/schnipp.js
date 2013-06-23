/**
 * checkbox field
 *
 * @param {object} field_descriptor field specific part of the form schema
 * @param {object} field_data initial value for the field
 * @constructor
 * @extends schnipp.dynforms.fields.checkbox
 **/
schnipp.dynforms.fields.checkbox = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.primitive_field(field_descriptor, field_data)
    self.default_value = false
    var _checked = self.get_initial_data() ? 'checked="checked"' : ''

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

    self._set = function(value) {
        self.dom.input.prop('checked', value)
    }

    return self
}

