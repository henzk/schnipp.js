/**
 * abstract base class for dynform fields
 *
 * @param {Object} field_descriptor field specific part of the form schema
 * @param {Object} field_data initial value for the field
 * @constructor
 * @class schnipp.dynforms.abstract_field
 * @module schnipp.dynforms
 **/
schnipp.dynforms.abstract_field = function(field_descriptor, field_data) {
    var self = {}
    self.default_value = '' /* override this in subclass */
    self.field_descriptor = field_descriptor
    self.initial_data = field_data
    self.events = schnipp.events.event_support()

    self.templates = {
        main: _.template('\
            <div class="schnippforms-field-holder schnippforms-field-<%=name%> schnippforms-<%=type%>">\
                <label></label>\
                <div class="schnippforms-dsc"></div>\
                <div class="schnippforms-help-text"></div>\
            </div>\
        '),
        errorlist: '<ul class="schnippforms-errorlist"></ul>'
    }
    self.dom = {main:null}

    /**
     * renders a field in a container with the field label
     *
     * @param {Object} field_descriptor the field`s schema
     * @param {Object} rendered_field jquery nodelist of the rendered field view
     * @return {Object} jquery nodelist containing rendered field view
     * @protected
     * @method render_container
     **/
    self.render_container = function(field_descriptor, rendered_field) {
        var main = $(self.templates.main({
            name: field_descriptor.name,
            type: field_descriptor.type
        }))
        var label = main.find('label')
        var dsc = main.find('.schnippforms-dsc')
        var help_text = main.find('.schnippforms-help-text')
        var input = main.find('.schnippforms-input')
        self.render_field_texts(field_descriptor, label, dsc, help_text)
        main.append(rendered_field)
        return main
    }

    /**
     * set the field's text attributes like label, description and help_text if specified
     * in field_descriptor, else remove dom nodes.
     *
     * @param {Object} field_descriptor the field`s schema
     * @param {Object} label jquery nodelist containing the label node
     * @param {Object} dsc jquery nodelist containing the description node
     * @param {Object} help_text jquery nodelist containing the help_text node
     * @protected
     * @method render_field_texts
     **/
    self.render_field_texts = function(field_descriptor, label, dsc, help_text) {
        // set label or remove label node
        if (field_descriptor.label !== undefined) 
            label.html(field_descriptor.label)
        else
            label.remove()
        // set dsc or remove dsc node
        if (field_descriptor.dsc !== undefined) 
            dsc.html(field_descriptor.description)
        else
            dsc.remove()
        // set help text or remove node
        if (field_descriptor.help_text !== undefined)
            help_text.html(self.render_help_text(field_descriptor))
        else
            help_text.remove()
    }

    /**
     * render the help text; you may overwrite this method to provide a more
     * sophisticated help text visualization like e.g. with tool tips
     * @param {string} field_descriptor
     * @return {Mixed} formated help text
     * @protected
     * @method render_help_text
     **/
    self.render_help_text = function(field_descriptor) {
        return field_descriptor.help_text
    }

    /**
     * render the input portion of the field
     * -must be implemented by subclass-
     * @return {Object} jquery nodelist containing input portion of rendered field view
     * @protected
     * @method render_input
     **/
    self.render_input = function() {
        throw {
            message: "get_data not implemented by abstract base class!"
        }
    }

    /**
     * render the form
     * @return {Object} jquery nodelist containing rendered field
     * @method render
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
     * -must be implemented by subclass-
     * @return {Mixed} field data (the format of the data depends on the
     * field type)
     *
     * @method get_data
     **/
    self.get_data = function() {
        throw {
            message: "get_data not implemented by abstract base class!"
        }
    }

    /**
     * reset field`s data to the default value
     * @method clear
     **/
    self.clear = function() {
        self.set_data(self.get_default_data())
    }

    /**
     * Returns the field's default data
     *
     * Default data is the value of 'default_value' in the field`s schema.
     * If it is not set, field.default_value is used.
     * @return {Mixed} default data of the field
     * @method get_default_data
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
     * @return {Mixed} initial data of the field
     * @method get_initial_data
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
     * -must be implemented in subclass-
     *
     * @param {Mixed} value field data(format depends on the field type)
     * @protected
     * @method _set
     **/
    self._set = function(value) {
        throw {
            message: "_set not implemented by abstract base class!"
        }
    }

    /**
     * set data of the field
     * @param {Mixed} value field data(format depends on the field type)
     * @method set_data
     **/
    self.set_data = function(value) {
        self._set(value)
        self.events.fire('change', {
            src: self,
            value: value
        })
    }

    /**
     * validates the field. Override this method in subclasses to add
     * specific validation to fields. This implementation checks
     * that required fields contain a value.
     * @returns {Object} validation result
     * @method validate
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
     * update view to indicate valid field data
     * @protected
     * @method render_valid
     **/
    self.render_valid = function() {
        self.dom.errorlist.remove()
        self.dom.main.removeClass('error')
    }

    /**
     * update view to indicate invalid field data
     * @protected
     * @method render_errors
     **/
    self.render_errors = function(errors) {
        if (self.dom.main) {
            self.dom.main.append(self.dom.errorlist)
            self.dom.errorlist.empty()
            $.each(errors, function(index, value) {
                self.dom.errorlist.append($(
                    '<li>' + value + '</li>'
                ))
            })
            self.dom.main.addClass('error')
        }
    }

    /**
     * triggers field validation
     * @return {Object} validation result
     * @method do_validate
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
     * @method initialize
     **/
    self.initialize = function() {}

    return self
}
