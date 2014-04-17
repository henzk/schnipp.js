/**
 * single select field
 *
 * @param {Object} field_descriptor field specific part of the form schema
 * @param {Object} field_data initial value for the field
 * @constructor
 * @class schnipp.dynforms.fields.select
 * @extends schnipp.dynforms.primitive_field
 **/
schnipp.dynforms.fields.select = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.primitive_field(field_descriptor, field_data)
    self.empty_selection_value = (self.field_descriptor.empty_selection_value !== undefined) ?
        self.field_descriptor.empty_selection_value : ''
    self.empty_selection_label = (self.field_descriptor.empty_selection_label !== undefined) ?
        self.field_descriptor.empty_selection_label : '---'

    if (!$.isArray(self.field_descriptor.options)) {
        throw {
            name: 'SchemaError',
            message: 'schema of select field "' + self.field_descriptor.name +
                '" must declare an options array',
            field: self.field_descriptor.name
        }
    }
    if (!self.field_descriptor.options.length) {
        throw {
            name: 'SchemaError',
            message: 'schema of select field "' + self.field_descriptor.name +
                '" must contain at least one option',
            field: self.field_descriptor.name
        }
    }
    var option_default = null
    var opts_hash = {}
    $.each(self.field_descriptor.options, function(idx, option) {
        if (!$.isArray(option) || option.length < 2) {
            throw {
                name: 'SchemaError',
                message: 'option ' + idx + ' of select field "' + self.field_descriptor.name +
                    '" must be an array with at least 2 elements',
                field: self.field_descriptor.name
            }
        }
        if (opts_hash.hasOwnProperty(option[0])) {
            throw {
                name: 'SchemaError',
                message: 'option ' + idx + ' of select field "' + self.field_descriptor.name +
                    '": key must be unique',
                field: self.field_descriptor.name
            }
        }
        opts_hash[option[0]] = true
        if (option.length === 3 && option[2]) {
            if (option_default === null) {
                option_default = option[0]
            } else {
                throw {
                    name: 'SchemaError',
                    message: 'options of select field "' + self.field_descriptor.name +
                        '" declare multiple defaults',
                    field: self.field_descriptor.name
                }
            }
        }
    })
    if (self.field_descriptor.default_value !== undefined) {
        if (option_default !== null) {
            throw {
                name: 'SchemaError',
                message: 'schema of select field "' + self.field_descriptor.name +
                    '" specifies both an option default and default_value',
                field: self.field_descriptor.name
            }
        }
    }
    if (option_default) {
        self.field_descriptor.default_value = option_default
    }

    var _selected = 'selected="selected"'

    self.dom.input = $(
        '<select name="' +
        self.field_descriptor.name +
        '" class="fieldtype_' + self.field_descriptor.type +
        '"></select>'
    )

    /**
     * get default data of field
     *
     * If 'default_value' is specified in the field schema,
     * its value is used as default data. Otherwise, the
     * first option is used as default i.e. the empty option for
     * non-required fields; the first valid option for required fields.
     *
     * @return {String} default data
     * @method get_default_data
     **/
    self.get_default_data = function() {
        if (self.field_descriptor.default_value !== undefined) {
            return self.field_descriptor.default_value
        }
        if (self.field_descriptor.required) {
            return self.field_descriptor.options[0][0]
        } else {
            return self.empty_selection_value
        }
    }

    /**
     * render the field
     *
     * @return {JQ} jquery nodelist containing the rendered view
     * of the field ready for DOM insertion
     * @method render
     **/
    var super_render = self.render
    self.render = function() {
        var initial_data = self.get_initial_data()

        if (!self.field_descriptor.required) {
            self.dom.input.append($(
                '<option ' +
                ((self.empty_selection_value == self.get_initial_data()) ? _selected : '') +
                '></option>'
            ).attr('value', self.empty_selection_value).text(self.empty_selection_label))
        }

        for (var i = 0; i < self.field_descriptor.options.length; i++) {
            var option = self.field_descriptor.options[i];
            var opt = $('<option></option>')
                .attr('value', option[0])
                .text(option[1])
            if (initial_data == option[0]) {
                opt.attr('selected', 'selected')
            }
            self.dom.input.append(opt)
        }
        return super_render()
    }

    return self
}
