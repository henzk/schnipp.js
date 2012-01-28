schnipp.forms.fields.select = function(field_descriptor, field_data) {
    var self = schnipp.forms.fields.base(field_descriptor, field_data);
    
    var _selected = 'selected="selected"';
    
    self.elems.input = $(
        '<select name="' + 
        self.field_descriptor.name +  
        '" class="fieldtype_' + self.field_descriptor.type + 
        '"></select>'
    );
    
    if (!self.field_descriptor.required) {
        self.elems.input.append($(
            '<option name="" ' + 
            (('' == self.field_data) ? _selected : '') + 
            '></option>'
        ));
    }
    
    for (var i = 0; i < field_descriptor.options.length; i++) {
        var option = field_descriptor.options[i];
        
        self.elems.input.append($(
            '<option name="' + option[0] + '" ' + 
            ((option[0] == self.field_data) ? _selected : '') + 
            '>' + option[1] + '</option>'
        ));
        
    }

    return self;
};

