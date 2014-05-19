
schnipp.dynforms.fields.xorform = function(field_descriptor, field_data, parent_dynform) {

    var fields = []

    fields.push({
        name: '_type',
        label: '',
        type: 'dropdownselect',
        options: field_descriptor.options,
    })

    $.each(field_descriptor.options, function(idx, val) {
        var field = $.extend({}, val)
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
        console.log(value)
        $.each(self.form.fields, function(key, field) {
            if (key != '_type') {
                if (key === value) {
                    field.dom.main.show()
                } else {
                    field.dom.main.hide()
                }
            }
        })
    }


    var _super_init = self.initialize
    self.initialize = function() {
        _super_init()
        self.form.fields._type.events.bind('change', toggle_visibility)
        toggle_visibility()
    }

    return self
}
