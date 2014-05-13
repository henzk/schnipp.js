/**
 * multiline text field
 *
 * @param {Object} field_descriptor field specific part of the form schema
 * @param {Object} field_data initial value for the field
 * @constructor
 * @class schnipp.dynforms.fields.textarea
 * @extends schnipp.dynforms.fields.text
 **/
schnipp.dynforms.fields.textarea = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.fields.text(field_descriptor, field_data)

    self.dom.input = $(
        '<textarea name="' +
        self.field_descriptor.name +
        '" class="fieldtype_' + self.field_descriptor.type +
        '"></textarea>'
    ).text(self.get_initial_data())
    
    self.dom.input.focus(function() {
        self.events.fire('focus', {field: self})
    })

    return self
}
