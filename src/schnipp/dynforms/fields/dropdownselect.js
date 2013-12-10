
//TODO: REFACTOR
schnipp.dynforms.fields.dropdownselect = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.abstractselect(field_descriptor, field_data)
    
    self.templates.dropdown = '\
        <div class="schnippforms-dropdownselect-select">\
            <div class="schnippforms-dropdownselect-input">\
                <div class="schnippforms-dropdownselect-display"></div>\
                <div class="schnippforms-dropdownselect-toggler"></div>\
            </div>\
            <div class="schnippforms-dropdownselect-options"></div>\
        </div>\
    '
    self.templates.option = _.template('<div><%=label%></div>')

    self.initialize = function() {
        self.events.bind('change', function(args) {
            self.dom.display.html(self.selected_option.label)
        })
        if (self.selected_option) {
            // TODO: mark fd.default_value as mandatory
            self.dom.display.html(self.selected_option.label)
        }
    }    
    
    self.render_input = function() {
        self.dom.dropdown = $(self.templates.dropdown)
        self.dom.display = self.dom.dropdown.find('.schnippforms-dropdownselect-display')
        self.dom.toggler = self.dom.dropdown.find('.schnippforms-dropdownselect-toggler')
        self.dom.options = self.dom.dropdown.find('.schnippforms-dropdownselect-options')
        
        // add toggle handler
        self.dom.display.add(self.dom.toggler).click(function() {
            if(self.dom.options.css('display') === 'none') {
                // remove classes in both cases; if done before case 1 wont match
                $('.schnippforms-dropdownselect').removeClass('active')
                self.dom.main.addClass('active')
            } else {
                $('.schnippforms-dropdownselect').removeClass('active')
                self.dom.main.removeClass('active')
            }
            
            return false
        })
        
        $('body').click(function() {
            if(self.dom.options.css('display') != 'none') {
                self.dom.main.removeClass('active')
            }
        })
        
        // render options
        $.each(field_descriptor.options, function(key, opt) {
            var item = $(self.templates.option({label:opt.label}))  
            self.dom.options.append(item)  
            item.click(function() {
                self.set_data(opt.value)
                self.dom.main.removeClass('active')
                return false
            })   
        })
        
       
        return self.dom.dropdown
    }
    
    

    return self
}
