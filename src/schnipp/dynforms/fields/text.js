/**
 * text field
 *
 * @param {Object} field_descriptor field specific part of the form schema
 * @param {Object} field_data initial value for the field
 * @constructor
 * @class schnipp.dynforms.fields.text
 * @extends schnipp.dynforms.primitive_field
 **/
schnipp.dynforms.fields.text = function(field_descriptor, field_data, parent_dynform) {
    var self = schnipp.dynforms.primitive_field(field_descriptor, field_data, parent_dynform)

    self.dom.input = $(
        '<input type="text" name="' +
        self.field_descriptor.name +
        '" class=" fieldtype_' + self.field_descriptor.type +
        '"/>'
    ).attr('value', self.get_initial_data())


    if (field_descriptor.placeholder !== undefined)
        self.dom.input.attr('placeholder', field_descriptor.placeholder)

    return self
}
schnipp.dynforms.fields.TextField = schnipp.dynforms.fields.text
