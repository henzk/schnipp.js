schnipp.dynforms.fields.text = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.fields.base(field_descriptor, field_data);
    
    self.dom.input = $(
        '<input type="text" name="' + 
        self.field_descriptor.name + 
        '" value="' + self.get_field_data() + 
        '" class="fieldtype_' + self.field_descriptor.type + 
        '"></input>'
    );

    return self;
};

