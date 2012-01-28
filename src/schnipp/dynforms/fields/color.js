schnipp.dynforms.fields.color = function(field_descriptor, field_data) {
    var self = schnipp.dynforms.fields.text(field_descriptor, field_data);
    
    self.initialize = function() {
        self.elems.input.click(function(e) {
            e = e || window.event;
            colorPicker(e);
            colorPicker.allowDrag = false;
            colorPicker.cP.style.zIndex = 1;
        });
    }
    
    return self;
};

