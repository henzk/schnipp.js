/**
 * floatingpoint field
 *
 * @param {object} field_descriptor field specific part of the form schema
 * @param {object} field_data initial value for the field
 * @constructor
 * @extends schnipp.dynforms.fields.integer
 **/
schnipp.dynforms.fields.floatingpoint = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.fields.integer(field_descriptor, field_data);

    self.get_data = function() {
        return parseFloat(self.super_get_data());
    };

    return self;
};
