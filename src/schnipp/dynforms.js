/**
 * dynamically create forms using a json description of form fields.
 * Forms are added to the DOM programatically - no html required.
 * New form field types incl. validation can be added easily.
 * @module schnipp.dynforms
 **/
schnipp.dynforms = {}

/**
 * the schnippform - give it a schema and some data and it`ll be your form
 *
 * @param {schnipp.dynforms.schema} schema the schema of the form.
 * @param {object} data initial form data in the format defined by schema(optional).
 * @param {object} fieldtypes replacements and additional field types for <tt>schnipp.dynforms.fields</tt>(optional).
 * @constructor
 * @class schnipp.dynforms.form
 **/
schnipp.dynforms.form = function(schema, data, fieldtypes) {

    var self = {}
    self.fieldtypes = $.extend({}, schnipp.dynforms.fields, fieldtypes)
    self.events = schnipp.events.event_support()
    self.schema = schema
    self.data = data || {}
    self.fields = {}
    self.field_schemata = {}
    self.dom = {}
    self.dom.fieldsets = []

    /**
     * renders a single fieldset
     * @param {object} fieldset obj
     * @return {jq} jquery nodelist of rendered fieldset
     * @protected
     * @method render_fieldset
     **/
    self.render_fieldset = function(fieldset) {

        var c = fieldset.classes || []
        var classnames = c.join(' ')
        var classes = ' class="schnippforms-fieldset ' + classnames + '"'
        var container = $('<div' + classes + '></div>')
        var holder = $('<div class="schnippforms-fieldset-fields"></div>')
        if (fieldset.label) {
            container.append($('<div class="schnippforms-label-container"><label>' + fieldset.label + '</label></div>'))
        }
        holder.append(self.render_fields(fieldset.fields_display))
        holder.append($('<div style="clear:both;"></div>'))
        container.append(holder)
        return container
    }

    /**
     * renders fieldsets
     * @param {Array} fieldsets array
     * @return {jq} jquery nodelist of rendered fieldsets
     * @protected
     * @method render_fieldsets
     **/
    self.render_fieldsets = function(fieldsets) {

        var res = $('<div class="schnippforms-fieldsets"></div>')
        for (var i = 0; i < fieldsets.length; i++) {
            var fieldset = fieldsets[i]
            var fieldset_node = self.render_fieldset(fieldset)
            res.append(fieldset_node)
            self.dom.fieldsets.push(fieldset_node)
        }
        return res
    }

    /**
     * renders fields
     * @param {object} fields array
     * @return {jq} jquery nodelist of rendered fields
     * @protected
     * @method render_fields
     **/
    self.render_fields = function(field_tree) {
        var res = $('<div></div>')
        for (var i = 0; i < field_tree.length; i++) {
            var entry = field_tree[i]
            if ($.isArray(entry)) {
                var row = $('<div class="schnippforms-form-row schnippforms-fields-horizontal"></div>')
                for (var j = 0; j < entry.length; j++) {
                    var col = entry[j]
                    var field_schema = self.field_schemata[col]
                    if (field_schema !== undefined) {
                        var field = self.fields[field_schema.name]
                        if (field !== undefined && !field._dynform_rendered) {
                            var rendered = self.render_field(field)
                            row.append(rendered)
                        }
                    }
                }
                res.append(row)
                res.append($('<div style="clear:both"></div>'))
            } else {
                var field_schema = self.field_schemata[entry]
                if (field_schema !== undefined) {
                    var field = self.fields[field_schema.name]
                    if (field !== undefined && !field._dynform_rendered) {
                        res.append(self.render_field(field))
                    }
                }
            }
        }
        return res
    }

    self.render_field = function(field) {
        var rendered = field.render()
        field._dynform_rendered = true
        return rendered
    }

    self._get_missing_fieldnames = function() {
        var missing = []
        $.each(self.schema.fields, function(idx, field_schema) {
            var field = self.fields[field_schema.name]
            if (!field._dynform_rendered) {
                missing.push(field_schema.name)
            }
        })
        return missing
    }


    self._create_fields = function() {
        self.fields = {}
        self.field_schemata = {}
        /* instanciate fields */
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = self.schema.fields[i]
            /* the field constructor gets the field`s schema, initial data,
               and a reference to the dynform(necessary for nested fields
               e.g. using schnipp.dynforms.fields.form). */

            if ( self.fieldtypes[field_schema.type] == undefined ) {
                throw 'The specified field type "' + field_schema.type + '" does not exist.'
            }
            var field = self.fieldtypes[field_schema.type](
                field_schema,
                self.data[field_schema.name],
                self
            )
            self.field_schemata[field_schema.name] = field_schema
            self.fields[field_schema.name] = field

        }
    }

    /**
     * render the form view
     *
     * @return {jq} html of rendered form as
     * jquery nodelist ready for dom insertion
     * @method render
     **/
    self.render = function() {

        self._create_fields()

        /* generate view */
        var view = $('<form class="schnippforms-form"></form>')
        if (self.schema.label) {
             view.append($('<label>' + self.schema.label + '</label>'))
        }
        var holder = $('<div class="schnippforms-form-holder"></div>')
        view.append(holder)

        if (self.schema['fieldsets'] != undefined) {
            holder.append(self.render_fieldsets(self.schema.fieldsets))
            var missing = self._get_missing_fieldnames()
            if (missing.length) {
                holder.append(self.render_fieldset({
                    label: 'MISSING',
                    fields_display: missing
                }))
            }
        } else if (self.schema['fields_display'] != undefined) {
            holder.append(self.render_fields(self.schema.fields_display))
            var missing = self._get_missing_fieldnames()
            if (missing.length) {
                holder.append(self.render_fields(missing))
            }
        } else {
            for (var i = 0; i < self.schema.fields.length; i++) {
                var field_schema = self.schema.fields[i]
                var field = self.fields[field_schema.name]
                var form_row = $('<div class="schnippforms-form-row"></div>')
                form_row.append(field.render())
                holder.append(form_row)
            }
        }

        self.dom.main = view
        return self.dom.main
    }

    /**
     * get current form data as object according to the form`s schema.
     * @return {object} form data
     * @method get_data
     **/
    self.get_data = function() {
        var data = {}
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = self.schema.fields[i]
            var field = self.fields[field_schema.name]
            data[field_schema.name] = field.get_data()
        }
        return data
    }

    /**
     * run form validation
     * @return {object} validation results contain a boolean property <tt>valid</tt>
     * and a property <tt>fields</tt> that contains a mapping of
     * fieldname to validation result of that field.
     * @method do_validate
     **/
    self.do_validate = function() {
        var data = {
            valid: true,
            fields: {},
            form: null
        }
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = self.schema.fields[i]
            var field = self.fields[field_schema.name]
            var result = field.do_validate()
            if (!result.valid) {
                data.valid = false
            }
            data.fields[field_schema.name] = result
        }

        data.form = self.validate_related()

        if (!data.form.valid) {
            data.valid = false
        }

        return data
    }

    /**
     * run form validation
     * @return {Boolean} true if form data contains no errors, false otherwise.
     * @method is_valid
     **/
    self.is_valid = function() {
        var is_valid = self.do_validate().valid

        // open collapsed fieldsets
        self.dom.main.find('.schnippforms-fieldset-fields').each(function() {
            if ($(this).find('.schnippforms-error').length && $(this).css('display') === 'none') {
                $(this).slideDown()
            }
        })

        var potentials = self.dom.main.find('.schnippforms-error')
        if (potentials.length) {
            // scroll to error fields
            $('html, body').animate({
                scrollTop: $(potentials[0]).offset().top
            }, 200)
        }

        return is_valid
    }

    /**
     * validate relations between selected values
     * override this
     * @return {object} validation result.
     * @method validate_related
     **/
    self.validate_related = function() {
        return {
            valid:true
        }
    }

    /**
     * set data of the form
     * @param {Object} data form data in format defined by schema.
     * @method set_data
     **/
    self.set_data = function(data) {
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = self.schema.fields[i]
            var field = self.fields[field_schema.name]
            // explicitely check, as data[field_schema.name] || field_schema.default_value
            // evaluates to default_value if data is 0!!!
            if (data[field_schema.name] == 0)
                var d = data[field_schema.name]
            else
                var d = data[field_schema.name] || field_schema.default_value
            field.set_data(d)
        }
    }

    /**
     * initialize the form after rendering it
     * @method initialize
     **/
    self.initialize = function(data) {
        // invoke form visitor if specified
        var vrunner = schnipp.dynforms.visitors.VRunner(self)
        vrunner.run()


        /* initialize fields */
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = self.schema.fields[i]
            var field = self.fields[field_schema.name]
            field.initialize()
        }

        $.each(self.fields, function(i, field) {
            field.events.bind('change', function() {
                self.events.fire('change', {
                    'field': field
                })
            })
        })

        if (self.schema.fieldsets) {
            for (var i=0; i<self.schema.fieldsets.length; i++) {
                var fs_schema = self.schema.fieldsets[i]
                var fs_node = self.dom.fieldsets[i]
                var label = fs_node.find('.schnippforms-label-container label')


                if (fs_schema.is_collapsed) {
                    fs_node.find('.schnippforms-fieldset-fields').hide()
                    label.append($('<i class="fa fa-sort-up"></i>'))
                } else {
                    label.append($('<i class="fa fa-sort-down"></i>'))
                }
                label.click(function() {
                    $(this).parent().parent().find('.schnippforms-fieldset-fields').slideToggle()
                    var icon = $(this).find('i')
                    if (icon.hasClass('fa-sort-down')) {
                        icon.removeClass('fa-sort-down')
                        icon.addClass('fa-sort-up')
                    } else if (icon.hasClass('fa-sort-up')) {
                        icon.removeClass('fa-sort-up')
                        icon.addClass('fa-sort-down')
                    }
                })
            }
        }
    }

    /**
     * iterate the fields - pass in a function
     * @param {Function} visitor function that is called for every field <tt>f</tt> of the form
     * with the arguments <tt>[i, f]</tt>, where <tt>i</tt> is the index of the respective field.
     * @method iter_fields
     **/
    self.iter_fields = function(visitor) {
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = self.schema.fields[i]
            var field = self.fields[field_schema.name]
            visitor(i, field)
        }
    }

    /**
     * get the schema of a field
     * @param {String} name name of the field
     * @return {Object} schema of field
     * @method get_field_schema
     **/
    self.get_field_schema = function(name) {
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = self.schema.fields[i]
            if (field_schema.name == name)
                return field_schema
        }
    }

    /**
     * update view to display validation errors
     * @param {Object} errors object that contains list of errors per fieldname.
     * @method render_errors
     **/
    self.render_errors = function(errors) {
        for (key in errors) {
            self.fields[key].render_errors(errors[key])
        }
    }

    return self
}

schnipp.dynforms.with_submit_button = function(original_form, save_button_label) {
    var self = original_form

    self.save_button_label = save_button_label

    var super_render = self.render
    self.render = function() {
        super_render()
        self.dom.main.submit(function() {
            return self.onsubmit()
        })
        var submit_row = $('<div class="submit-row"/>')
        var submit = $('<input type="submit"/>', {'value': save_button_label})
        submit_row.append(submit)
        self.dom.main.append(submit_row)
        return self.dom.main
    }

    self.onsubmit = function() {}

    return self
}


/**
 * Modelform which additionally takes an entity_type instance.
 * Provides a save method.
 * @class schnipp.dynforms.modelform
 * @extends schnipp.dynforms.form
 * @constructor
 * @param {schnipp.models.entity} entity_type
 * @param {schnipp.dynforms.schema} schema
 * @param {object} instance
 **/
schnipp.dynforms.modelform = function(entity_type, schema, instance) {

    var data = {}
    if(instance != undefined) {
        data = instance.get_data()
    } else {
        instance = entity_type(null, {})
    }

    var self = schnipp.dynforms.form(schema, data)
    self.instance = instance


    self.save = function(commit) {
        self.instance.update(self.get_data())
        if (commit == undefined || commit != undefined && commit != false) {
            // only pass the error callback
            self.instance.save(null, function(instance, errors) {
                self.render_errors(response.result)
            })
        }
        return self.instance
    }

    self.onsubmit = function(form) {
        if (form.is_valid())
            return form.save()
    }

    return self
}

/**
*   Factory for modelforms. Takes the schema, the entity_type and a
*   modifier which allows to patch the form instance.
*/
schnipp.dynforms.get_modelform = function(entity_type, schema, self_modifier) {

    self_modifier = self_modifier || function(self) {}

    return function(instance) {
        var form = schnipp.dynforms.modelform(entity_type, schema, instance)
        if (self_modifier != undefined) {
            var nform = self_modifier(form)
            if (nform != undefined) {
                form = nform
            }
        }
        return form
    }
}

/**
 * creates a form factory. Takes the schema and a modifier which
 * is used to patch the created form instances.
 * @param {schnipp.dynforms.schema} schema created forms will use this schema
 * @param {schnipp.dynforms.form# -> schnipp.dynforms.form#} instance_modifier -optional- function that is applied
 * to created forms before returning them. Can be used to wrap or patch created form instances.
 * @return {data -> schnipp.dynforms.form} factory function that accepts initial form data as object and returns a form instance with
 * the optional instance_modifier applied.
 **/
schnipp.dynforms.get_form_factory = function(schema, instance_modifier) {

    self_modifier = self_modifier || function(self) {}

    return function(data) {
        var form = schnipp.dynforms.form(schema, data)
        if (instance_modifier != undefined) {
            var nform = instance_modifier(form)
            if (nform != undefined) {
                form = nform
            }
        }
        return form
    }
}

/**
 * Shortcut to render a form and initialize it.
 *   Instantiates <formclass> with <instance> and inserts it into <target>.
 *   Can be used with both schnipp.dynforms.form and schnipp.dynforms.modelforms.
 */
schnipp.dynforms.insert_form = function(target, formclass, instance) {
    var form = formclass(instance)
    $(target).append(form.render_with_submit('Speichern'))
    form.initialize()
}
