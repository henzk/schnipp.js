/**
 *  @namespace
 *  @description
 *  dynamically create forms using a json description of form fields.
 *  Forms are added to the DOM programatically - no html required.
 *  New form field types incl. validation can be added easily.
 **/
schnipp.dynforms = {}

/**
 * @constructor
 * @description
 * the schnippform - give it a schema and some data and it`ll be your form
 *
 * @param {schnipp.dynforms.schema} schema the schema of the form.
 * @param {object} data initial form data in the format defined by schema(optional).
 * @param {object} fieldtypes replacements and additional field types for <tt>schnipp.dynforms.fields</tt>(optional).
 **/
schnipp.dynforms.form = function(schema, data, fieldtypes) {

    var self = {}
    self.fieldtypes = $.extend({}, schnipp.dynforms.fields, fieldtypes)
    /**
     * @name schnipp.dynforms.form#schema
     * @type {schnipp.dynforms.schema} 
     **/
    self.schema = schema
    self.data = data || {}
    self.fields = {}
    self.field_schemata = {}
    self.dom = {}

    /**
     * @name schnipp.dynforms.form#render_fieldset
     * @param {object} fieldset obj
     **/
    self.render_fieldset = function(fieldset) {
        var classnames = fieldset.classes.join(' ')
        var classes = ' class="schnippforms-fieldset ' + classnames + '"'
        var container = $('<div' + classes + '></div>')
        var holder = $('<div></div>')
        if (fieldset.label) {
            container.append($('<label>' + fieldset.label + '</label>'))
        }
        holder.append(self.render_fields(fieldset.fields_display))
        container.append(holder)
        return container
    }

    /**
     * @name schnipp.dynforms.form#render_fieldsets
     * @param {object} fieldset obj
     **/
    self.render_fieldsets = function(fieldsets) {
        var res = $('<div></div>')
        for (var i = 0; i < fieldsets.length; i++) {
            var fieldset = fieldsets[i]
            res.append(self.render_fieldset(fieldset))
        }
        return res
    }

    /**
     * @name schnipp.dynforms.form#render_fields
     * @param {object} fieldset obj
     **/
    self.render_fields = function(field_tree) {
        var res = $('<div></div>')
        for (var i = 0; i < field_tree.length;   i++) {
            var entry = field_tree[i]  
            if ($.isArray(entry)) {
                var row = $('<div class="schnippforms-form-row"></div>')  
                for (var j = 0; j < entry.length; j++) {
                    var col = entry[j]  
                    var field_schema = self.field_schemata[col]  
                    var field = self.fields[field_schema.name]  
                    var rendered = field.render()  
                    rendered.css({
                        'display': 'inline-block',
                        'float': 'left'
                    })  
                    row.append(rendered)  
                }
                res.append(row)  
                res.append($('<div style="clear:both"></div>'))  
            } else {
                var field_schema = self.field_schemata[entry]  
                var field = self.fields[field_schema.name]  
                res.append(field.render())  
            }
        }
        return res
    }

    /**
     * render the form
     *
     * @returns {jquery.nodelist} html of rendered form as 
     * jquery nodelist ready for dom insertion
     * @name schnipp.dynforms.form#render
     **/
    self.render = function() {
        self.fields = {}
        self.field_schemata = {}
        /* instanciate fields */
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = self.schema.fields[i]
            /* the field constructor gets the field`s schema, initial data,
               and a reference to the dynform(necessary for nested fields
               e.g. using schnipp.dynforms.fields.form). */
            var field = self.fieldtypes[field_schema.type](
                field_schema,
                self.data[field_schema.name],
                self
            )
            self.field_schemata[field_schema.name] = field_schema
            self.fields[field_schema.name] = field
        }
        /* generate view */
        var view = $('<form class="schnippforms-form"></form>')
        if (self.schema.label) {
             view.append($('<label>' + self.schema.label + '</label>'))
        }
        var holder = $('<div class="schnippforms-form-holder"></div>')
        view.append(holder)

        if (self.schema['fieldsets'] != undefined) {
            holder.append(self.render_fieldsets(self.schema.fieldsets))
        } else if (self.schema['fields_display'] != undefined) {
            holder.append(self.render_fields(self.schema.fields_display))
        } else {
            for (var i = 0; i < self.schema.fields.length; i++) {
                var field_schema = self.schema.fields[i]
                var field = self.fields[field_schema.name]
                holder.append(field.render())
            }
        }

        self.dom.main = view
        return self.dom.main
    }

    /**
     * get current form data as object according to the form`s schema.
     * @returns {object} form data
     * @name schnipp.dynforms.form#get_data
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
     * @returns {object} validation results contain a boolean property <tt>valid</tt>
     * and a property <tt>fields</tt> that contains a mapping of 
     * fieldname to list of errors of that field.
     * @name schnipp.dynforms.form#do_validate
     **/
    self.do_validate = function() {
        var data = {
            valid: true,
            fields: {}
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
        return data
    }

    /**
     * run form validation
     * @returns {boolean} true if form data contains no errors, false otherwise.
     * @name schnipp.dynforms.form#is_valid
     **/
    self.is_valid = function() {
        return self.do_validate().valid
    }

    /**
     * set data of the form
     * @param {object} data form data in format defined by schema.
     * @name schnipp.dynforms.form#set_data
     **/
    self.set_data = function(data) {
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = self.schema.fields[i]
            var field = self.fields[field_schema.name]
            field.set_data(data[field_schema.name] || field_schema.default_value)
        }
    }

    /**
     * initialize the form after rendering it 
     * @name schnipp.dynforms.form#initialize
     **/
    self.initialize = function(data) {
        /* initialize fields */
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = self.schema.fields[i]
            var field = self.fields[field_schema.name]
            field.initialize()
        }
        /* form funkyness */
        self.dom.main.children('div').children('div').children('.collapse').children('h3').click(function() {
            var self = $(this)
            self.parent().toggleClass('collapsed')
            self.parent().children('div').slideToggle()
        })
        self.dom.main.children('div').children('div').children('.collapse').children('div').hide()
        self.dom.main.children('div').children('div').children('.collapse').addClass('collapsed')
    }

    /**
     * iterate the fields - pass in a function 
     * @param {Function} visitor function that is called for every field <tt>f</tt> of the form
     * with the arguments <tt>[i, f]</tt>, where <tt>i</tt> is the index of the respective field.
     * @name schnipp.dynforms.form#iter_fields
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
     * @param name name of the field
     * @returns {object} schema of field
     * @name schnipp.dynforms.form#get_field_schema
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
     * @param {object} errors object that contains list of errors per fieldname.
     * @name schnipp.dynforms.form#render_errors
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
 * @constructor
 * @extends schnipp.dynforms.form
 * @description
 * Modelform which additionally takes an entity_type instance.
 * Provides a save method.
 *
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
 * @returns {data -> schnipp.dynforms.form#} factory function that accepts initial form data as object and returns a form instance with
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
