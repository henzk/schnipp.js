/**
 * floatingpoint field
 *
 * @param {Object} field_descriptor field specific part of the form schema
 * @param {Object} field_data initial value for the field
 * @constructor
 * @class schnipp.dynforms.fields.floatingpoint
 * @extends schnipp.dynforms.fields.integer
 **/
schnipp.dynforms.fields.floatingpoint = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.fields.integer(field_descriptor, field_data)

    var super_render = self.render
    self.render = function() {
        var rendered = super_render()
        self.set_data(self.get_initial_data())
        return rendered
    }

    /**
     * returns the field data
     *
     * @return {Float} field data as float; NaN if field data is invalid
     * @method get_data
     **/
    self.get_data = function() {
        var data = self.get_raw_data()
        if (self.field_descriptor.float_separator !== undefined) {
            data = data.replace(field_descriptor.float_separator, '.')
        }

        return parseFloat(data)
    }

    /**
     * set the field data
     *
     * @param {Float} data field data as float
     * @method get_data
     **/
    var super_set_data = self.set_data
    self.set_data = function(data) {
        var data = '' + data
        if (self.field_descriptor.float_separator !== undefined) {
            data = data.replace('.', field_descriptor.float_separator)
        }
        super_set_data(data)
    }

    return self
}
