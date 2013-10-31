
schnipp.ui.list = {}

schnipp.ui.list.delete_element = function(container, index, eltype) {
    container
        .children(eltype)
        .eq(index)
        .delete()
}

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
        main: dom_elem
    }
    self.conf = {
        elem_selector: 'li'
    }

    self.render_element = function(element) {
        var li = $('<li>')
        li.append(element.get('label'))
        return li
    }

    self.render_element_wrapper = function(element, rendered) {
        return rendered
    }

    self._do_render_element = function(element) {
        var view = self.render_element(element)
        return self.render_element_wrapper(element, view)
    }

    self.remove_element = function(index) {
        schnipp.ui.list.delete_element(
            self.dom.main,
            index,
            self.conf.elem_selector
        )
    }

    self.insert_element = function(index, element) {
        schnipp.ui.list.insert_element(
            index,
            element,
            self.dom.main,
            self._do_render_element
        )
    }

    self.set_element = function(index, element) {
        self.remove_element(index)
        self.insert_element(index, element)
    }

    self._handle_clear = function() {
        self.dom.main.empty()
    }

    self._handle_insert = function(attrs) {
        self.insert_element(attrs.index, attrs.element)
    }

    self._handle_remove = function(attrs) {
        self.remove_element(attrs.index)
    }

    self._handle_set = function(attrs) {
        self.set_element(attrs.index, attrs.new_value)
    }

    self.refresh = function() {
        self._handle_clear()
        self.model.each(function(idx, elem) {
            self.insert_element(idx, elem)
        })
    }

    self.init = function(model, container) {
        if (container !== undefined) {
            self.dom.main = container
        }
        self._handle_clear()
        self.model = model
        self.model.events
            .bind('clear', self._handle_clear)
            .bind('insert', self._handle_insert)
            .bind('remove', self._handle_remove)
            .bind('refresh', self.refresh)
            .bind('set', self._handle_set)
        self.refresh()
        return self
    }

    return self
}

schnipp.ui.list.SingleSelectListView = function(dom_elem) {
    var self = schnipp.ui.list.ListView(dom_elem)

    self._update_view_selection = function(element) {
        self.dom.main
            .children(self.conf.elem_selector)
            .removeClass('selected')
        if (element) {
            var idx = self.model.index_of(element)
            if (idx >= 0)
                self.dom.main
                    .children(self.conf.elem_selector)
                    .eq(idx)
                    .addClass('selected')
        }
    }

    self._handle_select = function(attrs) {
        if (attrs.old_value != attrs.new_value)
            self._update_view_selection({id: attrs.new_value})
    }

    self._handle_click = function(element) {
        self.model.select_element(element)
    }

    self.render_element_wrapper = function(element, rendered) {
        rendered.bind('click', function() {
            self._handle_click(element)
            return false
        })
        return rendered
    }

    var _super_init = self.init

    self.init = function(model, container) {
        _super_init(model, container)
        self.model.events
            .bind('selection-changed', self._handle_select)
        return self
    }

    return self
}
