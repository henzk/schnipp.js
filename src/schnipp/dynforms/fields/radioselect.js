schnipp.dynforms.fields.radioselect = function(field_descriptor, field_data, form) {
    var self = schnipp.dynforms.abstractselect(field_descriptor, field_data, form)
    self.options = null

    self.templates.radiogroup = '<div class="schnippforms-radioselect-group"></div>'
    self.templates.option = _.template('\
        <a href="#" class="schnippforms-radioselect-option " data-value="<%- value %>">\
            <span></span>\
            <div class="schnippforms-radioselect-icon"></div>\
            <label><%-label%></label>\
        </a>\
    ')
    
    self.initialize = function() {
        if (self.selected) {
            self.set_data(self.selected)
        }
    }   

    var _super_get_data = self.get_data
    self.get_data = function() {
        var val = _super_get_data()
        if (val === undefined) {
            return null
        } else {
            return val
        }
    }

    self._super__set = self._set
    self._set = function(value) {
        self._super__set(value)
        self.dom.main.find('.schnippforms-radioselect-option').removeClass('active')
        var opt = self.get_option_by_value(self.get_data())
        if (opt) {
            opt.domelem.addClass('active')
        }
    }

    self.render_input = function() {
        self.options = {}
        self.dom.radiogroup = $(self.templates.radiogroup)
        // render options
        $.each(field_descriptor.options, function(i, opt) {
            var item = $(self.templates.option({label:opt.label, value:opt.value, name: opt.id}))
            
            if (opt.title)
                item.find('label').prepend($('<b></b>').text(opt.title))
            
            self.dom.radiogroup.append(item)
            opt.domelem = item
            item.click(function() {
                item.focus()
                self.set_data(opt.value)
                return false
            })

            if (i === field_descriptor.options.length -1)
                self.dom.radiogroup.append('<div style="clear:both"></div>')

        })

        return self.dom.radiogroup
    }
    
    
    
    


    return self
}
