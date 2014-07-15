schnipp.dynforms.visitors = {}

/**
*   Helper that takes a form and runs the visitors of this form.   
*/
schnipp.dynforms.visitors.VRunner = function(form) {

    var self = {}
    
    /**
    *   Returns a list of visitors if any are specified. As dynforms support to add 
    *   visitors in string notation, too, those are instantiated.
    */
    self.get_visitors = function() {
        var visitors = []
        if (form.schema.visitors && form.schema.visitors.length) {
            $.each(form.schema.visitors, function(index, visitor) {
                if ($.type(visitor) === 'string') 
                    visitor = schnipp.dynforms.visitors[visitor]()    
                visitors.push(visitor)
            })
        }
        return visitors
    }
    
    self.visitors = self.get_visitors()
    

    /**
    *   Run all visitors on the form and the fields.
    */
    self.run = function() {
        $.each(self.visitors, function(index, visitor) {
            visitor.visit_form(form)
        })
        self.recursive_visit(form, form.schema.fields)
    }
    
    /**
    *   Run all visitors recursively on all nested fields.
    */
    self.recursive_visit = function(form, schema_fields) {
        $.each(schema_fields, function(i, field_schema) {
            var field = form.fields[field_schema.name]
            // invoke form visitor if specified
            $.each(self.visitors, function(index, visitor) {
                 visitor.visit_field(form, field)
            })
            if (field_schema.fields) {
                self.recursive_visit(field.form, field_schema.fields)
            }
        })
    }
            
    return self

}


schnipp.dynforms.visitors.helptext_visitor = function() {

    var self = {}
    self.dom = {
        display: $('<div class="schnf-hpv-display"></div>')
    }
    
    self.visit_form = function(form) {
        form.dom.main.addClass('schnf-hpv')
        form.dom.main.append(self.dom.display)
        form.dom.main.append($('<div style="clear:both"></div>'))
        
        form.dom.main.find('.schnippforms-label-container label').click(function() {
            self.dom.display.empty()
        })
        
    }

    self.visit_field = function(form, field) {
        
        field.events.bind('focus', function(args) {
            self.dom.display.empty()
            if (args.help_text || field.field_descriptor.help_text) {
                if (args.help_text) {
                    self.dom.display.append('<i class="fa fa-info-circle"></i> ' + args.help_text)
                } else if (field.field_descriptor.help_text) {
                    self.dom.display.append('<i class="fa fa-info-circle"></i> ' + field.field_descriptor.help_text)
                }
                
                /* positioning the help text  */
                
                // relative positioning of that field
                var top = field.dom.main.position().top
                
                // special handling for xorforms
                // there is a pos relative poperty which must be taken into account
                // to calculate the top positions for xorform helptexts
                var xorform = field.dom.main.closest('.schnf-xorform')
                if (xorform.length) {
                    top += xorform.position().top + 65 // 65 ~ height of dropdown container
                }
                
                if (top + self.dom.display.height() > form.dom.main.outerHeight()) {
                    // display on bottom
                    var value = top - self.dom.display.height() + field.dom.main.outerHeight()
                } else {
                    // display on top
                    var value = top + parseInt(field.dom.main.css('padding-top').split('px')[0])
                }
                self.dom.display.css('opacity', '0.1')
                self.dom.display.animate({
                    'margin-top': value + 'px',
                    'opacity': 1
                })
               
            }
        })
        
        
    }

    return self
}



