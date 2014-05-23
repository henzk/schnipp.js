/**
 * Integer field
 *
 * @param {Object} field_descriptor field specific part of the form schema
 * @param {Object} field_data initial value for the field
 * @constructor
 * @class schnipp.dynforms.fields.integer
 * @extends schnipp.dynforms.fields.text
 **/
schnipp.dynforms.fields.integer = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.fields.text(field_descriptor, field_data)

    self.get_raw_data = self.get_data

    /**
     * get field data
     *
     * @return {Integer} current value of the form as integer.
     * This will be NaN, if value is not an integer.
     * @method set_data
     **/
    self.get_data = function() {
        return parseInt(self.get_raw_data(), 10)
    }

    /**
     * run validation
     *
     * the field supports range checks, by setting 'min_value'
     * and 'max_value' via the fields schema
     * @return {Object} validation result
     * @method validate
     **/
    var super_validate = self.validate
    self.validate = function() {
        var res = super_validate()
        if (res.valid) {
            var data = self.get_data()
            var raw_data = self.get_raw_data()
            if (raw_data !== '' || self.field_descriptor.required) {
                if (isNaN(data)) {
                    res.valid = false
                    res.errors = {
                        nan: 'Please enter only numeric values'
                    }
                } else {
                    res.errors = {}
                    if (self.field_descriptor.min_value != undefined) {
                        if (self.field_descriptor.min_value > data) {
                            res.valid = false
                            res.errors.value_too_low = 'The entered value must be greater than or equal to ' +
                                self.field_descriptor.min_value + '.'
                        }
                    }
                    if (self.field_descriptor.max_value != undefined) {
                        if (self.field_descriptor.max_value < data) {
                            res.valid = false
                            res.errors.value_too_high = 'The entered value must be lower than or equal to ' +
                                self.field_descriptor.max_value + '.'
                        }
                    }
                }
            }
        }
        return res
    }

    return self
}
