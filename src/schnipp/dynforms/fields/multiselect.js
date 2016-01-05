/**
 * multiselect - multiple select field using chosen.js
 *
 * @param {Object} field_descriptor field specific part of the form schema
 * @param {Object} field_data initial value for the field
 * @constructor
 * @class schnipp.dynforms.fields.multiselect
 * @extends schnipp.dynforms.abstract_field
 **/
schnipp.dynforms.fields.multiselect = function(field_descriptor, field_data, parent_dynform) {

    var self = schnipp.dynforms.abstract_field(field_descriptor, field_data)

	self.templates.option = _.template('<option value="<%- opt.value %>"><%- opt.label %></option>')
	self.dom.select = $('<select multiple></select>')

	self.data = {
		selected: []
	}

	self.render_input = function() {

		$.each(field_descriptor.options, function(i, obj) {
			var opt = $(self.templates.option({opt: obj}))
			self.dom.select.append(opt)
		})
		return self.dom.select

	}

    self._set = function(selected_list) {
    	self.data.selected = selected_list
    }

    self.get_data = function() {
    	return self.data.selected
    }

    self.initialize = function() {
		//self.dom.select.chosen()

		self.dom.select.change(function() {
			self.set_data($(this).val())
		})

		self.events.bind('change', function(args) {
			$.each(args.value, function(i, value) {
				self.dom.select.find('option[value="' + value + '"]').attr('selected', true)
			})
			//self.dom.select.trigger("chosen:updated")
		})
    }

    return self
}
