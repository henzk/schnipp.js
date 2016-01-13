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
    var self = schnipp.dynforms.abstract_field(field_descriptor, field_data, parent_dynform)

    self.default_value = undefined
    self.objects = schnipp.models.object_list()
    self.templates.holder = '\
        <div>\
            <a class="schnippforms-inline-add"><i class="fa fa-plus-circle"></i> Hinzufügen</a>\
            <div class="schnippforms-inline-objects"></div>\
        </div>\
    '
    self.templates.action_td = '\
        <td class="schnippforms-inline-actions">\
            <a class="schnippforms-inlines-edit"><i class="fa fa-pencil"></i></a>\
            <a class="schnippforms-inlines-delete"><i class="fa fa-trash-o"></i></a>\
        </td>\
    '


    self.get_inline_schema = function() {
        return field_descriptor.form
    }

    self.get_form = function() {
        var inline_form = schnipp.dynforms.form(self.get_inline_schema(), {}, parent_dynform.fieldtypes)
        // monkeypatch the abstract's field get_form method in order to allow sub field to call it.
        // This enables subfield to access the most outer parent (root) form.
        inline_form.get_root_form = self.get_root_form
        return inline_form
    }

    self.init_changelist_fields = function() {
        /**
        * Preprocess list_display.
        */
        self.change_list_fields = []

        if (self.field_descriptor.list_display) {
           $.each(self.get_inline_schema().fields, function(index, field) {
                if (self.field_descriptor.list_display.indexOf(field.name) != -1)
                    self.change_list_fields.push(field)
            })
        } else {
            self.change_list_fields = self.get_inline_schema().fields
        }
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
            self.events.fire('change', self)
            $(tbody.children()[args.index]).remove()
        })


        // make rows sortable
        self.make_sortable()

        // set initial data.
        if (self.get_initial_data()) {
            $.each(self.get_initial_data(), function(i, obj) {
                self.objects.append(obj)
            })
        }

        self.dom.main.addClass('schnippforms-inlines')

        if (field_descriptor.label === undefined || field_descriptor.label === '') {
            self.dom.main.children('label').text('&nbsp;')
            self.dom.main.children('label').css('visibility', 'hidden')
        }
    }

    /**
    *   Render object row with change buttons.
    */
    self.render_row = function(obj) {
        var tr = $('<tr><td class="schnippforms-inline-handle"><i class="fa fa-arrows"></i></td></tr>')
        var tds = {}

        $.each(self.change_list_fields, function(i, field) {
            var td = $('<td></td>').text(obj[field.name])
            tds[field.name] = td
            tr.append(td)
        })

        var td = $(self.templates.action_td)
        var edit = td.find('.schnippforms-inlines-edit')
        var del = td.find('.schnippforms-inlines-delete')
        tr.append(td)

        tr.data('obj', obj)

        edit.click(function() {
            var d = schnipp.ui.Dialog().init()
            d.set_title('Element bearbeiten')
            d.set_content(self.render_change_form(d, obj, tds))
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
        self.init_changelist_fields()

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
            d.create()
            d.show()
            d._center()
            return false
        })

        return holder
    }


    /**
    *   Render edit form.
    */
    self.render_change_form = function(d, obj, tds) {
        var content = $('<div class="schnf-inlines-dialog"></div>')
        var submit = $('<div class="schnippforms-submit-row"><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> übernehmen</button></div>')

        var change_form = self.get_form()

        content.append(change_form.render())

        change_form.initialize()
        change_form.set_data(obj)

        content.find('form').append($('<div style="clear:both"></div>'))

        var f =  change_form.dom.main
        f.append(submit)

        f.submit(function() {
            if (change_form.is_valid()) {
                var data = change_form.get_data()
                for (key in data) {
                    if (tds[key])
                        tds[key].text(data[key])
                    obj[key] = data[key]
                }
                self.events.fire('change', self)
                d.close()
            }
            return false
        })
        return content
    }



    /**
    *   Render add form.
    */
    self.render_add_form = function(d) {
        var content = $('<div class="schnf-inlines-dialog"></div>')
        var submit = $('<div class="schnippforms-submit-row"><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> anlegen</button></div>')

        var add_form = self.get_form()
        content.append(add_form.render())
        add_form.initialize()

        content.find('form').append($('<div style="clear:both"></div>'))

        var f =  add_form.dom.main
        f.append(submit)

        f.submit(function() {
            if (add_form.is_valid()) {
                self.objects.append(add_form.get_data())
                self.events.fire('change', self)
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
            if (i == self.get_inline_schema().fields.length - 1)
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
        return self.objects.data
    }

    self._set = function(objects) {
        self.objects.clear()
        if (objects)
            for (var i=0; i<objects.length; i++) {
                var obj = objects[i]
                self.objects.append(obj)
            }
    }

    return self
}
