/**
 * abstract base class for dynform fields
 *
 * @param {object} field_descriptor field specific part of the form schema
 * @param {object} field_data initial value for the field
 * @constructor
 **/
schnipp.dynforms.abstract_field = function(field_descriptor, field_data) {
    var self = {}
    self.default_value = '' /* override this in subclass */
    self.field_descriptor = field_descriptor
    self.initial_data = field_data
    self.events = schnipp.events.event_support()

    self.templates = {
        main: _.template('\
            <div class="schnippforms-field-holder schnippforms-field-<%=name%> schnippforms-<%=type%> <%=extra_classes%>" >\
            </div>\
        '),
        errorlist: '<ul class="schnippforms-errorlist"></ul>'
    }
    self.dom = {main:null}

    /**
     * renders a field in a container with the field label
     *
     * @param {object} field_descriptor the field`s schema
     * @param {object} rendered_field jquery nodelist of the rendered field view
     * @returns {object} jquery nodelist containing rendered field view
     * @name schnipp.dynforms.abstract_field#render_container
     **/
    self.render_container = function(field_descriptor, rendered_field) {

        if (field_descriptor.extra_classes == undefined)
            field_descriptor.extra_classes = ''
        
        var main = $(self.templates.main({
            name: field_descriptor.name,
            type: field_descriptor.type,
            extra_classes: field_descriptor.extra_classes
        }))
        
       
        
        if (field_descriptor.classes !== undefined)
            $.each(field_descriptor.classes, function(i, cls) {main.addClass(cls)})
        
        // label
        if (field_descriptor.label !== undefined) {
            var label = $('<label></label>').text(field_descriptor.label)
            main.append(label)
            if (field_descriptor.required)
               label.addClass('schnippforms-required')   
        }

        // field
        main.append(rendered_field)
        
        // dsc
        if (field_descriptor.description !== undefined) 
            main.append($('<div class="schnippforms-field-dsc"></div>').text(field_descriptor.description))
        
        
        return main
    }
    
    

    /**
     * render the input portion of the field
     *
     * @returns {object} jquery nodelist containing input portion of rendered field view
     *
     * must be implemented by subclass
     *
     * @name schnipp.dynforms.abstract_field#render_input
     **/
    self.render_input = function() {
        throw {
            message: "get_data not implemented by abstract base class!"
        }
    }

    self.hide = function() {
        self.dom.main.hide()
    }
    
    self.show = function() {
        self.dom.main.show()
    }

    /**
     * render the form
     * @returns {object} jquery nodelist containing rendered field
     * @name schnipp.dynforms.abstract_field#render
     **/
    self.render = function() {
        self.dom.main = self.render_container(
            self.field_descriptor,
            self.render_input()
        )
        return self.dom.main
    }

    /**
     * get current field data
     * @returns {?} field data - the format of the data depends on the
     * field type
     *
     * must be implemented by subclass
     *
     * @name schnipp.dynforms.abstract_field#get_data
     **/
    self.get_data = function() {
        throw {
            message: "get_data not implemented by abstract base class!"
        }
    }

    /**
     * reset field`s data to the default value
     * @name schnipp.dynforms.abstract_field#clear
     **/
    self.clear = function() {
        self.set_data(self.get_default_data())
    }

    /**
     * Returns the field's default data
     *
     * Default data is the value of 'default_value' in the field`s schema.
     * If it is not set, field.default_value is used.
     * @name schnipp.dynforms.abstract_field#get_default_data
     **/
    self.get_default_data = function() {
        if (self.field_descriptor.default_value !== undefined) {
            return self.field_descriptor.default_value
        } else {
            return self.default_value
        }
    }

    /**
     * Returns the field's initial data or the default data if no initial data has been given.
     * @name schnipp.dynforms.abstract_field#get_initial_data
     **/
    self.get_initial_data = function() {
        if (self.initial_data !== undefined) {
            return self.initial_data
        } else {
            return self.get_default_data()
        }
    }

    /**
     * set data of the field
     * used internally by set_data to actually set the field
     *
     * must be implemented in subclass
     *
     * @param {?} field data - format depends on the field type
     * @name schnipp.dynforms.abstract_field#_set
     **/
    self._set = function(value) {
        throw {
            message: "_set not implemented by abstract base class!"
        }
    }

    /**
     * set data of the field
     * @param {?} field data - format depends on the field type
     * @name schnipp.dynforms.abstract_field#set_data
     **/
    self.set_data = function(value) {
        var old_value = self.get_data()
        self._set(value)
        self.events.fire('change', {
            src: self,
            value: value,
            old_value: old_value
        })
    }
 
    /**
     * validates the field. Override this method in subclasses to add
     * specific validation to fields. This implementation checks
     * that required fields contain a value.
     * @returns {object} validation result
     * @name schnipp.dynforms.abstract_field#validate
     **/
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
    }

    /**
    *   Removes the errorlist from dom and all error classes.
    */
    self.render_valid = function() {
        if (self.dom.errorlist) 
            self.dom.errorlist.remove()
        self.dom.main.removeClass('schnippforms-error')
    }

    
    self.render_errors = function(errors) {
        if (self.dom.errorlist)
            self.dom.errorlist.remove()
        if (self.dom.main) {
            self.dom.errorlist = $(self.templates.errorlist)
            self.dom.main.append(self.dom.errorlist)
            self.dom.errorlist.empty()
            $.each(errors, function(index, value) {
                self.dom.errorlist.append($(
                    '<li></li>'
                ).text(value))
            })
            self.dom.main.addClass('schnippforms-error')
        }
    }

    /**
     * triggers field validation
     * @returns {object} validation result
     * @name schnipp.dynforms.abstract_field#do_validate
     **/
    self.do_validate = function() {
        var validation_result = self.validate()
        if (validation_result.valid) {
            self.render_valid()
        } else {
            self.render_errors(validation_result.errors)
        }
        return validation_result
    }

    /**
     * initialize the field - must be called after the field has been rendered
     * and placed into the DOM of the page.
     * @name schnipp.dynforms.abstract_field#initialize
     **/
    self.initialize = function() {
    
    }

    return self
}
