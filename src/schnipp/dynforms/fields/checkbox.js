/**
 * checkbox field
 *
 * @param {Object} field_descriptor field specific part of the form schema
 * @param {Object} field_data initial value for the field
 * @constructor
 * @class schnipp.dynforms.fields.checkbox
 * @extends schnipp.dynforms.primitive_field
 * @module schnipp.dynforms.fields
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
                var label = $('<label></label>').text(field_descriptor.label)
                main.append(label)
            }
            return main
        }
    }
    
    self.super_initialize = self.initialize
    self.initialize = function() {
        //self.dom.main.hover(function() {
        //})
        self.dom.input.focus(function() {
            self.events.fire('focus', {field: self})
        })

        self.dom.input.change(function() {
            self.events.fire('change', {
                src: self,
                value: self.get_data()
            })
        })

    }


    /**
     * get field data
     * @return {Boolean} true if checked, false otherwise
     * @method get_data
     **/
    self.get_data = function() {
        return self.dom.input.prop('checked')
    }

    /**
     * set field data
     * @param {Boolean} value true for checked checkbox, false otherwise
     * @protected
     * @method _set
     **/
    self._set = function(value) {
        self.dom.input.prop('checked', value)
    }

    return self
}
