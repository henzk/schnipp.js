schnipp.dialogs.dialog = function(parent, component_name) {
    var self = schnipp.dialogs.component(parent, component_name)
    self.ui_type='dialog'
    
    self.tmpl.main = _.template('\
        <div data-schnui="dialog" class="schn_dialog">\
            <div class="schn_titlebar">\
                <span class="schn_title"><%= title %></span>\
                <a class="schn_close">x</a>\
            </div>\
            <div class="schn_content">\
            </div>\
        </div>')
        
    self.dom.content = null
    
    //set dialog content
    self.view.set_content = function(content) {
        self.dom.content.html(content)
        self.ctrl.init_content()
        return self
    }
    
    //set dialog title
    self.view.set_title = function(title) {
        self.dom.view.find('.schn_title').html(title)
        return self
    }
    
    //set draggability
    self.view.draggable = function(draggable) {
        if (draggable) {
            self.dom.view.draggable({ stack: ".schn_dialog" })
        } else {
            self.dom.view.draggable('destroy')
        }
        return self
    }
    
    //set resizability
    self.view.resizable = function(resizable) {
        if (resizable) {
            self.dom.view.resizable()
        } else {
            self.dom.view.resizable('destroy')
        }
        return self
    }
    
    //cleanup
    self.ctrl.do_cleanup = function() {
        self.dom.view.remove()
    }
    
    //close action
    self.ctrl.close = self.ctrl.cleanup
    
    //initialize dialog view
    self.ctrl.init_view = function() {
        self.dom.view.find('.schn_close').click(function() {
            self.ctrl.close()
        })
        self.view.draggable(true)
        return self
    }
    
    //initialize dialog content
    self.ctrl.init_content = function() {
        //set title
        var title = ''
        var title_elem = self.dom.content.find(
            schnipp.dialogs._conf.selectors.dialog_title
        )
        if (title_elem.length) {
            title = title_elem.attr(
                'data-dialogtitle'
            )
        }
        self.view.set_title(title)
        
        schnipp.dialogs.enable_for(self.dom.content, self)
        schnipp.dialogs._bootstrapper.fire_and_unbind('bootstrap', self)
        return self
    }
    
    //display the dialog ... normally called just once
    self.do_render = function() {
        var view = $(self.tmpl.main({
            title: ''
        }))
        return view
    }
    
    self.do_register_elems = function() {
        self.dom.content = self.dom.view.find('.schn_content')
    }
    
    return self
}

schnipp.dialogs._component_types['dialog'] = schnipp.dialogs.dialog
