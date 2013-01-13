/**
 * dynform field - allows nesting of forms
 *
 * @param {object} field_descriptor field specific part of the form schema
 * @param {object} field_data initial value for the field
 * @constructor
 * @extends schnipp.dynforms.fields.base
 **/
schnipp.dynforms.fields.form = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.fields.base(field_descriptor, field_data);
    
    self.form = schnipp.dynforms.form(field_descriptor, field_data);
    
    self.render = function() {
        return self.form.render();
    };
    
    self.set_data = function(data) {
        return self.form.set_data(data);
    };
    
    self.get_data = function() {
        return self.form.get_data();
    };

    self.initialize = function() {
        self.form.initialize();
    };
    
    return self;
};

