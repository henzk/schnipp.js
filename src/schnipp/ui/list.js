
schnipp.ui.list = {}
schnipp.ui.list.insert_element = function(index, element, container, render_element) {
    var el_view = render_element(element)
    if (index == 0)
        container.prepend(el_view)
    else {
        container
            .children(el_view.nodeName)
            .eq(index - 1)
            .after(el_view)
    }
} 

schnipp.ui.list.ListView = function(dom_elem) {

    var self = {}
    self.model = null
    self.dom = {
        container: dom_elem
    }
    self.conf = {
        elem_selector: 'li'
    }

    self.render_element = function(element) {
        var li = $('<li>')
        li.append(element.get('label'))
        return li
    }
    
    self.insert_element = function(index, element) {
        schnipp.ui.list.insert_element(
            index, 
            element, 
            self.dom.container, 
            self.render_element
        )
    }

    self._handle_clear = function() {
        self.dom.container.empty()
    }

    self._handle_insert = function(attrs) {
        self.insert_element(attrs.index, attrs.element)
    }

    self.init = function(model, container) {
        if (container != undefined)
            self.dom.container = container
        self._handle_clear()
        self.model = model
        self.model.events
            .bind('clear', self._handle_clear)
            .bind('insert', self._handle_insert)
        return self
    }

    return self
}

schnipp.ui.list.SingleSelectListView = function(dom_elem) {
    var self = schnipp.ui.list.ListView(dom_elem)
    
    self.select_element = function(element) {
        self.dom.container
            .children(self.conf.elem_selector)
            .removeClass('selected')
        if (element) {
            var idx = self.model.index_of(element)
            if (idx >= 0)
                self.dom.container
                    .children(self.conf.elem_selector)
                    .eq(idx)
                    .addClass('selected')
        }
    }
    
    self._handle_select = function(attrs) {
        if (attrs.old_value != attrs.new_value)
            self.select_element(attrs.new_value)
    }
    
    var _super_render_element = self.render_element
    
    self.render_element = function(element) {
        var li = _super_render_element(element)
        li.bind('click', function() {
            self.model.select_element(element)
        })
        return li
    }
    
    var _super_init = self.init
    
    self.init = function(model) {
        _super_init(model)
        self.model.events
            .bind('selection-changed', self._handle_select)
        return self
    }
    
    return self
}


