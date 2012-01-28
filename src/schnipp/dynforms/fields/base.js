schnipp.forms.fields.base = function(field_descriptor, field_data) {
    var self = {};
    self.field_descriptor = field_descriptor;
    self.field_data = field_data || self.field_descriptor.default_value;
    
    self.elems = {
        input: null,/* must be set in subclass */
        errorlist: $(
            '<ul class="errorlist"></ul>'
        ),
        holder: null
    };
    
    self.render = function() {
        self.elems.holder = schnipp.forms.render_field(
            self.field_descriptor, 
            self.elems.input,
            self.elems.errorlist
        );
        return self.elems.holder;
    };
    
    self.get_data = function() {
        return self.elems.input.val();
    };
    
    self.set_data = function(value) {
        self.elems.input.val(value);
    };
    
    self.validate = function() {
        if (self.field_descriptor.required) {
            if ($.trim(self.get_data()) == '') {
                return {
                    valid: false,
                    errors: {
                        required: 'This field is required'
                    }
                };
            }
        }
        return {valid: true};
    };
    
    self.render_valid = function() {
        /*self.elems.input.css('border','1px solid green');*/
        self.elems.errorlist.remove();
    };
    
    self.render_errors = function(errors) {
        if (self.elems.holder) {
            self.elems.holder.append(self.elems.errorlist);
            self.elems.errorlist.empty();
            $.each(errors, function(index, value) {
                self.elems.errorlist.append($(
                    '<li>' + value + '</li>'
                ));
            });
        }
        
        /*self.elems.input.css('border', '1px solid red');*/
    }
    
    self.do_validate = function() {
        var validation_result = self.validate();
        if (validation_result.valid) {
            self.render_valid();
        } else {
            self.render_errors(validation_result.errors);
        }
        return validation_result;
    };
    
    self.initialize = function() {};
    
    return self;
};

