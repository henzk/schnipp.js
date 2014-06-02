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

    self.default_value = field_descriptor.default_value || {_selected: false}

    var checkbox_default = false
    if (field_descriptor.default_value !== undefined) {
        checkbox_default = field_descriptor.default_value._selected
    }

    self.checkbox = schnipp.dynforms.fields.checkbox({
        name: field_descriptor.name,
        label: field_descriptor.label,
        type: 'checkbox',
        default_value: checkbox_default,
        style: 'box_left'
    }, field_data._selected)

    self.form = schnipp.dynforms.form(
        $.extend({}, field_descriptor, {label:''}),
        field_data,
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

        self.checkbox.set_data(data._selected || false)
        self.form.set_data(data)
    }

    self.get_data = function() {
        var data = $.extend({}, self.form.get_data())
        data._selected = self.checkbox.get_data()
        return data
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
