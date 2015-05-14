/**
 * Provides a slider for integer values
 *
 * @param {Object} field_descriptor field specific part of the form schema
 * @param {Object} field_data initial value for the field
 * @constructor
 * @class schnipp.dynforms.fields.intslider
 * @extends schnipp.dynforms.abstract_field
 **/
schnipp.dynforms.fields.intslider = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.abstract_field(field_descriptor, field_data)
    self.data = {
        value: null
    }
    
    self.dom.input = $('\
        <div class="schnf-slider-container">\
            <div class="schnf-slider"></div>\
            <div class="schnf-slider-display"></div>\
        </div>\
    ')
    self.dom.slider = self.dom.input.find('.schnf-slider')
    
    /**
    *   Initializes the slider and returns the dom object.
    */
    self.render_input = function() {
        self.dom.slider.slider({
            min: field_descriptor.min,
            max: field_descriptor.max,
            change: function( event, ui ) {
                console.log(self.dom.slider.slider('value'))
                self.set_data(self.dom.slider.slider('value'))
            },
            slide: function( event, ui ) {
                self.events.fire('slide', {value: self.dom.slider.slider('value')})
            }
        })
        return self.dom.input
    }
    
    self._set = function(value) {
        self.data.value = value
    }    
    
    self.get_data = function() {
        return self.data.value
    }
    
    self.initialize = function() {
        self.dom.slider.slider('value', self.get_initial_data())
    }
        

    return self
}
