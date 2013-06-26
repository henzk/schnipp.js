
/**
 * integer field
 *
 * @param {object} field_descriptor field specific part of the form schema
 * @param {object} field_data initial value for the field
 * @constructor
 * @extends schnipp.dynforms.fields.text
 **/
schnipp.dynforms.fields.integerrange = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.fields.integer(field_descriptor, field_data)
    
    self.templates = $.extend(self.templates, {
        range: '<div class="schnippforms-field-integerrange"></div>',
        number: _.template('<a><%=label%></a>')
    })

    self.render_input= function() {
        var intrange = $(self.templates.range)
        // create range items according to min/max values
        var values = []
        for (var i = self.field_descriptor.min_value; i<= self.field_descriptor.max_value; i++) {
            values.push(i)
        }
        // build html structure
        $.each(values, function(i, v) {
            var a = $(self.templates.number({label:v}))
            intrange.append(a)
            a.click(function() {
                
                if (a.hasClass('active') && !a.next().hasClass('active') && v != field_descriptor.min_value) {
                    self.dom.input.val(v - 1)
                    self.highlight_active_items(v - 1, intrange.find('a'))
                } else {
                    self.dom.input.val(v)
                    self.highlight_active_items(v, intrange.find('a'))
                }
                return false
            })
            
            // activate and highlight first item
            if (i === 0) {
                self.highlight_active_items(v, $([a]))
                self.dom.input.val(v)
            }
                
        })
        return intrange
    }
    
    self.highlight_active_items = function(current, siblings) {
        siblings.removeClass('active') 
        $.each(siblings, function(i, item) {
            if (i + field_descriptor.min_value <= current)
                $(item).addClass('active')
        })
    }
    
    return self
}
