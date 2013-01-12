/*
schnipp forms - rockit
*/
schnipp.dynforms = {}




/*
the schnippform
give me a schema and some data - i will be your form
*/
schnipp.dynforms.form = function(schema, data) {
    var self = {}
    
    self.schema = schema
    self.data = data || {}
    self.fields = {}
    self.field_schemata = {}
    self.dom = {}
    
    self.render_fieldset = function(fieldset) {

        var classes = fieldset.classes.join(' ')
        if (classes) {
            classes = ' class="' + classes + '"'
        }
        var res = $('<div' + classes + '></div>')
        var holder = res
        if (fieldset.label) {
            res.append($('<h3>' + fieldset.label + '</h3>'))
            holder = $('<div></div>')
            res.append(holder)
        }
        holder.append(self.render_fields(fieldset.fields_display))

        return res
    }
    
    self.render_fieldsets = function(fieldsets) {

        var res = $('<div></div>')
        for (var i = 0; i < fieldsets.length; i++) {
            var fieldset = fieldsets[i]
            res.append(self.render_fieldset(fieldset))
        }

        return res
    }

    
    self.render_fields = function(field_tree) {
        var res = $('<div></div>')
        for (var i = 0; i < field_tree.length;   i++) {
            var entry = field_tree[i]  
            if ($.isArray(entry)) {
                var row = $('<div class="form-row"></div>')  
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
    
    /* render the form */
    self.render = function() {

        self.fields = {}  
        self.field_schemata = {}  
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = self.schema.fields[i]  
            var field = schnipp.dynforms.fields[field_schema.type](field_schema, self.data[field_schema.name])  
            self.field_schemata[field_schema.name] = field_schema  
            self.fields[field_schema.name] = field  
        }
        var res = $('<form class="schnippforms-form"></form>')  
        if (self.schema.label) {
             res.append($('<h3 class="schnippforms-form-label">' + self.schema.label + '</h3>'))  
        }
        var holder = $('<div class="schnippform-form-holder"></div>')  
        res.append(holder)  
        
        
        if (self.schema['fieldsets'] != undefined) {
            holder.append(self.render_fieldsets(schema.fieldsets))  
        } else if (self.schema['fields_display'] != undefined) {
            holder.append(self.render_fields(schema.fields_display))  
        } else {
            for (var i = 0; i < schema.fields.length; i++) {
                var field_schema = schema.fields[i]  
                var field = self.fields[field_schema.name]  
                holder.append(field.render())  
            }
        }
        
        self.dom.main = res  
        
        self.dom.main.submit(function() {
            self.show_spinner()
            self.onsubmit(self)
            return false
        })
        
        return res  
    }  
    
    
    self.render_with_submit = function(value) {
        var submit_row = $('<div class="submit-row"/>')
        var submit = $('<input type="submit"/>', {'value': value})
        submit_row.append(submit)

        self.dom.main = self.render()
        self.dom.main.append($(submit_row))
        
        return self.dom.main
    }
    
    self.onsubmit = function() {}
    
    self.show_spinner = function() {
        self.dom.main.addClass('schnappdocs-spinner')
    }
    
    self.hide_spinner = function() {
        self.dom.main.removeClass('schnappdocs-spinner')
    }

    
    /* extract current data */
    self.get_data = function() {
        var data = {}  
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = schema.fields[i]  
            var field = self.fields[field_schema.name]  
            data[field_schema.name] = field.get_data()  
        }
        return data  
    }  

    /* run form validation */
    self.do_validate = function() {
        var data = {
            valid: true,
            fields: {}
        }  
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = schema.fields[i]  
            var field = self.fields[field_schema.name]  
            var result = field.do_validate()  
            if (!result.valid) {
                data.valid = false
            }
            data.fields[field_schema.name] = result 
        }
        return data  
    }  
    
    self.is_valid = function() {
        return self.do_validate().valid
    }

    /* fill in new data in the form */
    self.set_data = function(data) {
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = schema.fields[i]  
            var field = self.fields[field_schema.name]  
            field.set_data(data[field_schema.name] || field_schema.default_value)  
        }
    }  
    
    /* initialize the form after rendering it */
    self.initialize = function(data) {
        /* initialize fields */
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = schema.fields[i]  
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
    
    /* iterate the fields - pass in a function */
    self.iter_fields = function(visitor) {
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = schema.fields[i]  
            var field = self.fields[field_schema.name] 
            visitor(i, field)  
        }
    }  
    /* returns the field specified  by name */
    self.get_field_schema = function(name) {
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = schema.fields[i]  
            if (field_schema.name == name)
                return field_schema
        }
    }
    
    self.render_errors = function(errors) {
        for (key in errors) {
            self.fields[key].render_errors(errors[key])
        }
    }
    
    
    
    return self  
}  








/**
*   Modelform which additionally takes an entity_type instance.
*   Provides a save method.
*/
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
        if (self_modifier != undefined)
            self_modifier(form)
        return form
    }
}

/**
*   Factory for forms. Takes the schema and a modifier which 
*   allows to patch the form instance.
*/
schnipp.dynforms.get_form = function(schema, self_modifier) {

    self_modifier = self_modifier || function(self) {}

    return function(data) {
        var form = schnipp.dynforms.form(schema, data)
        if (self_modifier != undefined)
            self_modifier(form)
        return form
    }
}

/**
*   Instantiates <formclass> with <instance> and inserts it into <target>.
*   Can be used with both schnipp.dynforms.form and schnipp.dynforms.modelforms.
*/
schnipp.dynforms.insert_form = function(target, formclass, instance) {
    var form = formclass(instance)
    $(target).append(form.render_with_submit('Speichern')) 
    form.initialize()   
}


