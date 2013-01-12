
/*
renders a field in a container div with label and stuff.
*/
schnipp.dynforms.render_field = function(field_descriptor, rendered_field, errorlist) {
    
    var holder = $('<div class="field-holder field-' + field_descriptor.name +  '"></div>')
    
    if (field_descriptor.label != undefined || field_descriptor.label != null) {
        var label = '<label>' + field_descriptor.label + ' : </label>'
        holder.append(label)
    }
    
    holder.append(rendered_field)
    
    if (errorlist != undefined)
        rendered_field.after(errorlist)
    
    return holder
}



schnipp.dynforms.fields.base = function(field_descriptor, field_data) {
    var self = {} 
    self.field_descriptor = field_descriptor 
    self.field_data = field_data || self.field_descriptor.default_value 
    
    
    self.dom = {
        input: null,/* must be set in subclass */
        errorlist: $(
            '<ul class="errorlist"></ul>'
        ),
        holder: null
    } 
    
    self.render = function() {
        self.dom.holder = schnipp.dynforms.render_field(
            self.field_descriptor, 
            self.dom.input
        ) 
        return self.dom.holder 
    } 
    
    self.get_data = function() {
        return self.dom.input.val() 
    } 
    
    self.clear = function() {
        self.dom.input.val('')
    }
    
    /**
    *   Returns the field's internal data or an empty string instead of undefinied.
    */
    self.get_field_data = function() {
        return self.field_data || ''
    }
    
    self.set_data = function(value) {
        self.dom.input.val(value) 
    } 
    
    self.validate = function() {
        if (self.field_descriptor.required) {
            if ($.trim(self.get_data()) == '') {
                return {
                    valid: false,
                    errors: {
                        required: 'This field is required'
                    }
                } 
            }
        }
        return {valid: true} 
    };
    
    self.render_valid = function() {
        self.dom.errorlist.remove() 
        self.dom.holder.removeClass('error')
    } 
    
    self.render_errors = function(errors) {
        if (self.dom.holder) {
            self.dom.holder.append(self.dom.errorlist)
            self.dom.errorlist.empty() 
            $.each(errors, function(index, value) {
                self.dom.errorlist.append($(
                    '<li>' + value + '</li>'
                )) 
            }) 
            self.dom.holder.addClass('error')
        }
        /*self.dom.input.css('border', '1px solid red') */
    }
    
    self.do_validate = function() {
        var validation_result = self.validate() 
        if (validation_result.valid) {
            self.render_valid() 
        } else {
            self.render_errors(validation_result.errors) 
        }
        return validation_result 
    } 
    
    self.initialize = function() {} 
    
    return self 
} 

