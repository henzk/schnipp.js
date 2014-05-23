/**
 * dynform field - allows nesting of forms
 *
 * @param {Object} field_descriptor field specific part of the form schema
 * @param {Object} field_data initial value for the field
 * @param {Object} parent_dynform reference to the dynform instance that contains this field
 * @constructor
 * @class schnipp.dynforms.fields.form
 * @extends schnipp.dynforms.abstract_field
 **/
schnipp.dynforms.fields.form = function(field_descriptor, field_data, parent_dynform) {
    var self = schnipp.dynforms.abstract_field(field_descriptor, field_data)
    self.form = schnipp.dynforms.form(field_descriptor, field_data, parent_dynform.fieldtypes)

    

    self.render = function() {
        self.dom.main = self.form.render()
        return self.dom.main
    }

    self._set = function(data) {
        return self.form.set_data(data)
    }

    self.get_data = function() {
        return self.form.get_data()
    }

    self.initialize = function() {
        self.form.initialize()
        self.form.events.bind('change', function(args) {
            self.events.fire('change', args)
        })
    }

    return self
}
