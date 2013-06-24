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

    if (field_descriptor.style === 'box_left') {
        self.render_container = function(field_descriptor, rendered_field) {
            var main = $('<div class="field-holder field-' + field_descriptor.name +  '"></div>')
            main.append(rendered_field)
            if (field_descriptor.label !== undefined || field_descriptor.label !== null) {
                var label = '<label>' + field_descriptor.label + '</label>'
                main.append(label)
            }
            return main
        }
    }

    self.get_data = function() {
        return self.dom.input.prop('checked')
    }

    self._set = function(value) {
        self.dom.input.prop('checked', value)
    }

    return self
}

