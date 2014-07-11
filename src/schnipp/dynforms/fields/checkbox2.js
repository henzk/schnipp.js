/**
 * checkbox field
 *
 * @param {Object} field_descriptor field specific part of the form schema
 * @param {Object} field_data initial value for the field
 * @constructor
 * @class schnipp.dynforms.fields.checkbox
 * @extends schnipp.dynforms.primitive_field
 * @module schnipp.dynforms.fields
 **/
schnipp.dynforms.fields.checkbox2 = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.abstract_field(field_descriptor, field_data)
    self.default_value = false

    self.checked = self.get_initial_data() 


    /**
     * renders a field in a container with the field label
     *
     * @param {object} field_descriptor the field`s schema
     * @param {object} rendered_field jquery nodelist of the rendered field view
     * @returns {object} jquery nodelist containing rendered field view
     * @name schnipp.dynforms.abstract_field#render_container
     **/
    self._super_render_container = self.render_container
    self.render_container = function(field_descriptor, rendered_field) {
        var main = self._super_render_container(field_descriptor, rendered_field)
        main.find('label').remove()
        return main
    }

    
    self.render_input = function() {
        self.dom.input = $(_.template('\
            <div>\
                <i></i>\
                <span><%= label %></span>\
            </div>\
        ')({label:field_descriptor.label}))
        self.dom.checkbox = self.dom.input.find('i')
        
        
        // prevent check for links within label
        if (self.dom.input.find('a').length) {
            self.dom.checkbox.click(self.click)
        } else {
            self.dom.input.click(self.click)
        }
        
        
        return self.dom.input
    }
    
    self.click = function() {
        self.set_data(!self.checked)
        self.events.fire('focus', {field:self})
        return false
    }
    
    self.initialize = function() {
        self.set_icon_classes()
        self.events.bind('change', function(args) {
            self.set_icon_classes()
        })
        
    }
    
    self.set_icon_classes = function() {
        if (self.checked) {
            self.dom.checkbox.attr('class', 'fa fa-check-square-o')
            self.dom.input.addClass('schnf-checked')
        } else {
            self.dom.checkbox.attr('class','fa fa-square-o')
            self.dom.input.removeClass('schnf-checked')
        }
    }
    
    
    self.validate = function() {
        
        if (self.field_descriptor.required) {
            if (!self.get_data()) {
                return {
                    valid: false,
                    errors: {
                        required: 'This field is required'
                    }
                }
            }
        }
        return {valid: true}
    }
    

    /**
     * get field data
     * @return {Boolean} true if checked, false otherwise
     * @method get_data
     **/
    self.get_data = function() {
        return self.checked
    }

    /**
     * set field data
     * @param {Boolean} value true for checked checkbox, false otherwise
     * @protected
     * @method _set
     **/
    self._set = function(value) {
        self.checked = value
    }

    return self
}
