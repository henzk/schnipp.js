/**
 * base class for dynform fields
 *
 * @param {object} field_descriptor field specific part of the form schema
 * @param {object} field_data initial value for the field
 * @constructor
 **/
schnipp.dynforms.fields.base = function(field_descriptor, field_data) {
    var self = {}
    self.default_value = '' /* override this in subclass */
    self.field_descriptor = field_descriptor
    self.initial_data = field_data

    self.dom = {
        input: null,/* must be set in subclass */
        holder: null,
        errorlist: $(
            '<ul class="errorlist"></ul>'
        )
    }

    /**
     * renders a field in a container with the field label
     *
     * @param {object} field_descriptor the field`s schema
     * @param {object} rendered_field jquery nodelist of the rendered field view
     * @name schnipp.dynforms.fields.base#render_container
     **/
    self.render_container = function(field_descriptor, rendered_field) {
        var holder = $('<div class="field-holder field-' + field_descriptor.name +  '"></div>')
        if (field_descriptor.label !== undefined) {
            var label = '<label>' + field_descriptor.label + ' : </label>'
            holder.append(label)
        }
        holder.append(rendered_field)
        return holder
    }

    /**
     * render the form
     * @returns {object} jquery nodelist containing rendered field
     * @name schnipp.dynforms.fields.base#render
     **/
    self.render = function() {
        self.dom.holder = self.render_container(
            self.field_descriptor, 
            self.dom.input
        ) 
        return self.dom.holder
    }

    /**
     * get current field data
     * @returns {?} field data - the format of the data depends on the
     * field type
     * @name schnipp.dynforms.fields.base#get_data
     **/
    self.get_data = function() {
        return self.dom.input.val()
    }

    /**
     * reset field`s data to the default value
     * @name schnipp.dynforms.fields.base#clear
     **/
    self.clear = function() {
        self.set_data(self.get_default_data())
    }

    /**
     * Returns the field's default data
     *
     * Default data is the value of 'default_value' in the field`s schema.
     * If it is not set, field.default_value is used.
     * @name schnipp.dynforms.fields.base#get_default_data
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
     * @name schnipp.dynforms.fields.base#get_initial_data
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
     * @param {?} field data - format depends on the field type
     * @name schnipp.dynforms.fields.base#set_data
     **/
    self.set_data = function(value) {
        self.dom.input.val(value)
    }

    /**
     * validates the field. Override this method in subclasses to add
     * specific validation to fields. This implementation checks 
     * that required fields contain a value.
     * @returns {object} validation result
     * @name schnipp.dynforms.fields.base#validate
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
    }

    /**
     * triggers field validation
     * @returns {object} validation result
     * @name schnipp.dynforms.fields.base#do_validate
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
     * initialize the field - called after the field has been rendered
     * and placed into the DOM of the page.
     * @name schnipp.dynforms.fields.base#initialize
     **/
    self.initialize = function() {}

    return self
}
