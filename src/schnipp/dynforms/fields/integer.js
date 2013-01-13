/**
 * integer field
 *
 * @param {object} field_descriptor field specific part of the form schema
 * @param {object} field_data initial value for the field
 * @constructor
 * @extends schnipp.dynforms.fields.text
 **/
schnipp.dynforms.fields.integer = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.fields.text(field_descriptor, field_data);

    self.super_get_data = self.get_data;
    self.get_data = function() {
        return parseInt(self.super_get_data(), 10);
    };
    
    var super_validate = self.validate;
    self.validate = function() {
        var res = super_validate();
        if (res.valid) {
            var data = self.get_data();
            if (isNaN(data)) {
                res.valid = false;
                res.errors = {
                    nan: 'Please enter only numeric values'
                };
            } else{
                res.errors = {};
                if (self.field_descriptor.min_value != undefined) {
                    if (self.field_descriptor.min_value > data) {
                        res.valid = false;
                        res.errors.value_too_low = 'The entered value must be greater than or equal to ' + 
                            self.field_descriptor.min_value + '.';
                    }
                }
                if (self.field_descriptor.max_value != undefined) {
                    if (self.field_descriptor.max_value < data) {
                        res.valid = false;
                        res.errors.value_too_high = 'The entered value must be lower than or equal to ' + 
                            self.field_descriptor.max_value + '.';
                    }
                }
            }
        }
        return res;
    };
    
    return self;
};
