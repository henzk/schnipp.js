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
            if (args.help_text) {
                self.dom.display.append('<i class="fa fa-info-circle"></i> ' + args.help_text)
            } else if (field.field_descriptor.help_text) {
                self.dom.display.append('<i class="fa fa-info-circle"></i> ' + field.field_descriptor.help_text)
            }        
        })
        
        
    }

    return self
}



