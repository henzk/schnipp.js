/**
 * choice field
 *
 * @param {object} field_descriptor field specific part of the form schema
 * @param {object} field_data initial value for the field
 * @constructor
 * @extends schnipp.dynforms.fields.base
 **/
schnipp.dynforms.fields.select = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.fields.base(field_descriptor, field_data)
    
    var _selected = 'selected="selected"'
    
    self.dom.input = $(
        '<select name="' + 
        self.field_descriptor.name +  
        '" class="fieldtype_' + self.field_descriptor.type + 
        '"></select>'
    )
    
    if (!self.field_descriptor.required) {
        self.dom.input.append($(
            '<option name="" ' + 
            (('' == self.get_field_data()) ? _selected : '') + 
            '></option>'
        ))
    }
    
    for (var i = 0; i < field_descriptor.options.length; i++) {
        var option = field_descriptor.options[i];
        var $opt = $('<option value="' + option[0] + '">' + option[1] + '</option>')
        if (option.length == 3 && option[2] == 'selected') {
            $opt.attr('selected', 'selected')
        }
        self.dom.input.append($opt)
    }
    

    return self
}

