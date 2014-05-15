/*
    {
        name: 'myinlines',
        type: 'inlines',
        list_display: ['position'],
        form: {
            name: 'myform',
            visitors: ['helptext_visitor'],
            fields: [
                {
                    name: 'Position',
                    type: 'integer'
                },
                {
                    name: 'Description',
                    type: 'textarea'
                },
                {
                    name: 'Price',
                    type: 'float'
                }
            ]
        }
    }
*/

schnipp.dynforms.fields.inlines = function(field_descriptor, field_data, parent_dynform) {
    var self = schnipp.dynforms.abstract_field(field_descriptor, field_data)
    self.form = schnipp.dynforms.form(field_descriptor.form, {}, parent_dynform.fieldtypes)
    self.change_form = schnipp.dynforms.form(field_descriptor.form, {}, parent_dynform.fieldtypes)
    self.objects = schnipp.models.observable_list()
    self.templates.holder = '\
        <div>\
            <a class="schnippforms-inline-add"><i class="fa fa-plus"></i> Hinzufügen</a>\
            <div class="schnippforms-inline-objects"></div>\
        </div>\
    '
    self.templates.action_td = '\
        <td class="schnippforms-inline-actions">\
            <a class="schnippforms-inlines-edit"><i class="fa fa-pencil"></i></a>\
            <a class="schnippforms-inlines-delete"><i class="fa fa-trash-o"></i></a>\
        </td>\
    '
    
    
    /**
    * Preprocess list_display.
    */
    self.change_list_fields = []

    if (self.field_descriptor.list_display) {
       $.each(self.form.schema.fields, function(index, field) {
            if (self.field_descriptor.list_display.indexOf(field.name) != -1)
                self.change_list_fields.push(field)       
        })
    } else {
        self.change_list_fields = self.form.schema.fields
    }
    
        
    
 
    
    
    
    var super_initialize = self.initialize
    self.initialize = function() {
        super_initialize()
        var tbody = self.dom.changelist_table.find('tbody')
        // handle insert
        self.objects.events.bind('insert', function(args) {
            tbody.append(self.render_row(args.element))  
            self.dom.changelist_table.sortable().find('tbody').sortable('refresh')
        })
        // handle remove
        self.objects.events.bind('remove', function(args) {
            $(tbody.children()[args.index]).remove()
        })
        // make rows sortable
        self.make_sortable()
        // set initial data.
        $.each(self.get_initial_data(), function(i, obj) {
            self.objects.append(obj)
        })
    }
    
   
    /**
    *   Render object row with change buttons.
    */
    self.render_row = function(obj) {
        var tr = $('<tr><td class="schnippforms-inline-handle"><i class="fa fa-arrows"></i></td></tr>')
        var tds = {}
        
        $.each(self.change_list_fields, function(i, field) {
            var td = $('<td></td>').text(obj.get(field.name))
            tds[field.name] = td
            tr.append(td)
        })
        
        var td = $(self.templates.action_td)
        var edit = td.find('.schnippforms-inlines-edit')
        var del = td.find('.schnippforms-inlines-delete')
        tr.append(td)
        
        // this is hacky but necessary to enable data change on row sort.
        tr.data('obj', obj)

        edit.click(function() {
            var d = schnipp.ui.Dialog().init()
            d.set_title('Element bearbeiten')
            d.set_content(self.change_form.render())
            self.change_form.set_data(obj.raw_data)
            self.change_form.initialize()
            var f = d.dom.main.find('form')
            f.append($('<input type="submit" value="Übernehmen"/>'))
            f.submit(function() {
                if (self.change_form.is_valid()) {
                    var data = self.change_form.get_data()
                    for (key in data) {
                        if (tds[key])
                            tds[key].text(data[key])                        
                        obj.set(key, data[key])
                    }
                    d.close()
                }
                return false
            })    
            d.show()
            return false
        })
        
        del.click(function() {
            var doit = confirm('Element wirklich löschen?')
            if (doit)
                self.objects.remove($(this).closest('tr').prevAll().length)
            return false
        })
        return tr
    }

    


    /**
    *   Main visualization of the field. Handle add button;
    */
    self.render_input = function() {
        var holder = $(self.templates.holder)
        var a = holder.find('a.schnippforms-inline-add')
        var changelist = holder.find('.schnippforms-inline-objects')
        self.dom.changelist_table = self.render_changelist()
        changelist.append(self.dom.changelist_table)
        
        a.click(function() {
            var d = schnipp.ui.Dialog().init()
            
            if (self.field_descriptor.dialog_title)
                d.set_title(self.field_descriptor.dialog_title)
            else
                d.set_title('Element hinzufügen')
            
            var dialog_content = self.render_add_form(d)
            d.set_content(dialog_content)
            d.show()           
            return false
        })
        
        return holder    
    }    
    
    /**
    *   Render add form.
    */
    self.render_add_form = function(d) {
        var content = $('<div></div>')
        var submit = $('<div class="schnippforms-submit-row"><button type="submit"><i class="fa fa-check"></i> anlegen</button></div>')
        content.append(self.form.render())
        self.form.initialize()
        
        var f =  content.find('form')
        f.append(submit)
        
        
        f.submit(function() {
            if (self.form.is_valid()) {
                self.objects.append(self.form.get_data())
                for (var i=0; i<self.form.fields.length; i++) {
                    var field = self.form.fields[i]
                    field.clear()
                }
                d.close()
            }
            return false
        })
        
        return content
    }
    
    
    /**
    *   Render empty the changelist.
    */
    self.render_changelist = function() {
        var table = $('<table><thead></thead><tbody></tbody></table>')
        var thead = table.find('thead')
        var tr = $('<tr></tr>')
        
        
        $.each(self.change_list_fields, function(i, field) {
            th = $('<th></th>').text(field.label)
            if (i == self.form.schema.fields.length - 1)
                th.attr('colspan', '2')
            if (i == 0) 
                th.attr('colspan', '2')
            tr.append(th)
        })
        thead.append(tr)
        return table
    }
    
    /**
    *   Apply sortable functionality on table rows.
    */
    self.make_sortable = function() {
        var tbody = self.dom.changelist_table.find('tbody')
        tbody.sortable({
            distance: 10,
            helper: function(e, ui) {
	            ui.children().each(function() {
		            $(this).width($(this).width())
	            })
	            return ui
            },
            stop: function() {
                self.objects.clear()
                tbody.children().each(function(i, elem) {
                    self.objects.data.push($(elem).data('obj'))                
                })
            }
        }).disableSelection()
    }
    
    
    self.get_data = function() {
        return self.objects.get_data()
    }
    
    
    self._set = function(objects) {
        if (objects)
            for (var i=0; i<objects.length; i++) {
                var obj = objects[i]
                self.objects.append(obj)
            }
    }
    
    return self
}

