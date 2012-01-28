/*
schnipp forms - rockit
*/
schnipp.dynforms = {};

/*
renders a field in a container div with label and stuff
*/
schnipp.dynforms.render_field = function(field_descriptor, rendered_field, errorlist) {
    var outer = $('<div><span class="label">' + field_descriptor.label + ' : </span></div>');
    //outer.prepend(errorlist);
    outer.append(rendered_field);
    return outer;
};


/*
the schnippform
give me a schema and some data - i will be your form
*/
schnipp.dynforms.form = function(schema, data) {
    var self = {};
    
    self.schema = schema;
    self.data = data || {};
    self.fields = {};
    self.field_schemata = {};
    self.view = null;
    
    self.render_fieldset = function(fieldset) {

        var classes = fieldset.classes.join(' ');
        if (classes) {
            classes = ' class="' + classes + '"';
        }
        var res = $('<div' + classes + '></div>');
        var holder = res;
        if (fieldset.label) {
            res.append($('<h3 class="ui-widget-header ui-corner-top">' + fieldset.label + '</h3>'));
            holder = $('<div class="ui-widget-content ui-corner-bottom"></div>');
            res.append(holder);
        }
        holder.append(self.render_fields(fieldset.fields_display));

        return res;
    };
    
    self.render_fieldsets = function(fieldsets) {

        var res = $('<div></div>');
        for (var i = 0; i < fieldsets.length; i++) {
            var fieldset = fieldsets[i];
            res.append(self.render_fieldset(fieldset));
        }

        return res;
    };

    
    self.render_fields = function(field_tree) {
        var res = $('<div></div>');
        for (var i = 0; i < field_tree.length; i++) {
            var entry = field_tree[i];
            if ($.isArray(entry)) {
                var row = $('<div class="form_row"></div>');
                for (var j = 0; j < entry.length; j++) {
                    var col = entry[j];
                    var field_schema = self.field_schemata[col];
                    var field = self.fields[field_schema.name];
                    var rendered = field.render();
                    rendered.css({
                        'display': 'inline-block',
                        'float': 'left'
                    });
                    row.append(rendered);
                }
                res.append(row);
                res.append($('<div style="clear:both"></div>'));
            } else {
                var field_schema = self.field_schemata[entry];
                var field = self.fields[field_schema.name];
                res.append(field.render());
            }
        }
        return res;
    };
    
    /* render the form */
    self.render = function() {

        self.fields = {};
        self.field_schemata = {};
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = self.schema.fields[i];
            var field = schnipp.dynforms.fields[field_schema.type](field_schema, self.data[field_schema.name]);
            self.field_schemata[field_schema.name] = field_schema;
            self.fields[field_schema.name] = field;
        }
        var res = $('<div></div>');
        res.append($('<h3 class="ui-widget-header ui-corner-top">' + self.schema.label + '</h3>'));
        var holder = $('<div class="ui-widget-content ui-corner-bottom"></div>');
        res.append(holder);
        
        
        if (self.schema['fieldsets'] != undefined) {
            holder.append(self.render_fieldsets(schema.fieldsets));
        } else if (self.schema['fields_display'] != undefined) {
            holder.append(self.render_fields(schema.fields_display));
        } else {
            for (var i = 0; i < schema.fields.length; i++) {
                var field_schema = schema.fields[i];
                var field = self.fields[field_schema.name];
                holder.append(field.render());
            }
        }
        res.addClass('ui-widget');
        self.view = res;
        return res;
    
    };
    
    /* extract current data */
    self.get_data = function() {
        var data = {};
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = schema.fields[i];
            var field = self.fields[field_schema.name];
            data[field_schema.name] = field.get_data();
        }
        return data;
    };

    /* run form validation */
    self.do_validate = function() {
        var data = {};
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = schema.fields[i];
            var field = self.fields[field_schema.name];
            data[field_schema.name] = field.do_validate();
        }
        return data;
    };

    /* fill in new data in the form */
    self.set_data = function(data) {
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = schema.fields[i];
            var field = self.fields[field_schema.name];
            field.set_data(data[field_schema.name] || field_schema.default_value);
        }
    };
    
    /* initialize the form after rendering it */
    self.initialize = function(data) {
        /* initialize fields */
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = schema.fields[i];
            var field = self.fields[field_schema.name];
            field.initialize();
        }
        /* form funkyness */
        self.view.children('div').children('div').children('.collapse').children('h3').click(function() {
            var self = $(this);
            self.parent().toggleClass('collapsed')
            self.parent().children('div').slideToggle();
        });
        self.view.children('div').children('div').children('.collapse').children('div').hide();
        self.view.children('div').children('div').children('.collapse').addClass('collapsed');
        
    };
    
    /* iterate the fields - pass in a function */
    self.iter_fields = function(visitor) {
        for (var i = 0; i < self.schema.fields.length; i++) {
            var field_schema = schema.fields[i];
            var field = self.fields[field_schema.name];
            visitor(field, index);
        }
    };
    
    return self;
};
