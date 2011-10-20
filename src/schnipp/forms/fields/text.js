schnipp.forms.fields.text = function(field_descriptor, field_data) {
    var self = schnipp.forms.fields.base(field_descriptor, field_data);
    
    self.elems.input = $(
        '<input type="text" name="' + 
        self.field_descriptor.name + 
        '" value="' + self.field_data + 
        '" class="fieldtype_' + self.field_descriptor.type + 
        '"></input>'
    );

    return self;
};

