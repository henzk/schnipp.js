/**
 * optional dynform field - nested form that can be toggled via checkbox
 *
 * @param {object} field_descriptor field specific part of the form schema
 * @param {object} field_data initial value for the field
 * @param {object} parent_dynform reference to the dynform instance that contains this field
 * @constructor
 * @extends schnipp.dynforms.fields.optionalform
 **/
schnipp.dynforms.fields.optionalform = function(field_descriptor, field_data, parent_dynform) {

    var field_data = (field_data !== undefined) ? field_data : {}
    var self = schnipp.dynforms.abstract_field(field_descriptor, field_data)

    self.default_value = {selected: false}

    self.checkbox = schnipp.dynforms.fields.checkbox({
        name: field_descriptor.name,
        label: field_descriptor.label,
        type: 'checkbox',
        default_value: field_descriptor.default_value,
        style: 'box_left'
    }, field_data.selected)

    self.form = schnipp.dynforms.form(
        $.extend({}, field_descriptor, {label:''}),
        field_data.value,
        parent_dynform.fieldtypes
    )

    self.render = function() {
        var container = self.checkbox.render()
        container.append(self.form.render())
        self.dom.main = container
        return container
    }

    self._set = function(data) {
        if (data === undefined) data = {}

        self.checkbox.set_data(data.selected)
        self.form.set_data(data.value)
    }

    self.get_data = function() {
        return {
            selected: self.checkbox.get_data(),
            value: self.form.get_data()
        }
    }

    var toggle_visibility = function() {
        if (self.checkbox.get_data()) {
            self.form.dom.main.show()
        } else {
            self.form.dom.main.hide()
        }
    }

    self.initialize = function() {
        self.checkbox.initialize()
        self.form.initialize()
        self.checkbox.events.bind('change', toggle_visibility)
        toggle_visibility()
    }

    return self
}
