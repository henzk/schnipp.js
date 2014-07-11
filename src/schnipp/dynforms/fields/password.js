schnipp.dynforms.fields.password = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.fields.text(field_descriptor, field_data)

    self.dom.input = $(
        '<input type="password" name="' +
        self.field_descriptor.name +
        '" class="fieldtype_' + self.field_descriptor.type +
        '"/>'
    ).text(self.get_initial_data())
    
    self.dom.input.focus(function() {
        self.events.fire('focus', {field: self})
    })

    return self
}
