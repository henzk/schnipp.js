schnipp.forms.fields.form = function(field_descriptor, field_data) {
    var self = schnipp.forms.fields.base(field_descriptor, field_data);
    
    self.form = schnipp.forms.form(field_descriptor, field_data);
    
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

