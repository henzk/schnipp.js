schnipp.dynforms.fields.checkbox = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.fields.base(field_descriptor, field_data);
    
    var _checked = self.field_data ? 'checked="checked"' : '';
    
    self.elems.input = $(
        '<input type="checkbox" name="' + 
        self.field_descriptor.name + 
        '" ' + _checked + 
        '" class="fieldtype_' + self.field_descriptor.type + 
        '"></input>'
    );

    self.get_data = function() {
        return self.elems.input.prop('checked');
    };
    
    self.set_data = function(value) {
        self.elems.input.prop('checked', value);
    };

    return self;
};

