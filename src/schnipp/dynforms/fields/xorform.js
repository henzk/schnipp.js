
schnipp.dynforms.fields.xorform = function(field_descriptor, field_data, parent_dynform) {

    var fields = []

    fields.push({
        name: '_type',
        label: '',
        type: 'dropdownselect',
        options: field_descriptor.options,
    })

    console.log(field_data)

    $.each(field_descriptor.options, function(idx, val) {
        var field = $.extend({}, val)
        field.label = '&nbsp;'
        field.name = field.value
        field.type = 'form'
        fields.push(field)
    })

    field_descriptor.fields = fields

    var self = schnipp.dynforms.fields.form(field_descriptor, field_data, parent_dynform)

    self._set = function(data) {
        if (data === undefined) data = {}
        self.form.fields._type.set_data(data._type)
        if (self.form.fields[data._type]) {
            self.form.fields[data._type].set_data(data)
        }
    }

    self.get_data = function() {
        var _type = self.form.fields._type.get_data()
        if (self.form.fields[_type]) {
            var value = self.form.fields[_type].get_data()
            value._type = _type
            return value
        }
        return {_type: _type}
    }

    var toggle_visibility = function() {
        var value = self.form.fields._type.get_data()

        $.each(self.form.fields, function(key, field) {
            if (key != '_type') {
                if (key === value && field.field_descriptor.fields.length) {
                    // show subform if selected but only if it also provides fields
                    field.dom.main.show('blind')
                } else {
                    field.dom.main.hide('blind')
                }
            }
        })
    }


    var _super_init = self.initialize
    self.initialize = function() {
        _super_init()
        self.form.fields._type.events.bind('change', toggle_visibility)
        self.form.dom.main.addClass('schnf-xorform')

        // preselect a xorform value by default_value
        if (self.field_descriptor.default_value)
            self.form.fields._type.set_data(self.field_descriptor.default_value)
        self.set_data(field_data)
        toggle_visibility()
    }

    return self
}
