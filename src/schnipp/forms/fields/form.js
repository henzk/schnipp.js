schnipp.forms.fields.form = function(field_descriptor, field_data) {
    var self = schnipp.forms.fields.base(field_descriptor, field_data);
    
    self.form = schnipp.forms.form(field_descriptor, field_data);
    
    self.render = function() {
        var holder = $('<div class="nestedform"><h5>' + self.field_descriptor.label + '</h5></div>');
        holder.append(self.form.render());
        return holder;
    };
    
    self.set_data = function(data) {
        return self.form.set_data(data);
    };
    
    self.get_data = function() {
        return self.form.get_data();
    };

    return self;
};

