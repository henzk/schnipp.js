schnipp.dynforms.visitors = {}

schnipp.dynforms.visitors.helptext_visitor = function() {

    var self = {}
    self.dom = {
        display: $('<div class="schnf-hpv-display"></div>')
    }
    
    self.visit_form = function(form) {
        form.dom.main.addClass('schnf-hpv')
        form.dom.main.append(self.dom.display)
        form.dom.main.append($('<div style="clear:both"></div>'))
        
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
                var top = field.dom.main.position().top
                if (top + self.dom.display.height() > form.dom.main.outerHeight()) {
                    var value = top - self.dom.display.height() + field.dom.main.outerHeight()
                } else {
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



