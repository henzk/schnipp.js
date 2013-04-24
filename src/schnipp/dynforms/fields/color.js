/**
 * colorpicker field
 *
 * @param {object} field_descriptor field specific part of the form schema
 * @param {object} field_data initial value for the field
 * @constructor
 * @extends schnipp.dynforms.fields.text
 **/
schnipp.dynforms.fields.color = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.fields.text(field_descriptor, field_data);
    
    self.initialize = function() {
        self.dom.input.click(function(e) {
            e = e || window.event;
            colorPicker(e);
            colorPicker.allowDrag = false;
            colorPicker.cP.style.zIndex = 1;
        });
    }
    
    return self;
};

