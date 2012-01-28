//the dialog ... finally ;)
schnipp.dialogs.dialog = function(parent, dialogname) {
    var self = {}
    self.parent = parent
    //set name with 'default' as fallback
    self.name = dialogname
    if (!self.name) {
        self.name = 'default'
    }
    //dialogs opened from this one
    self.children = []
    //template stuff ... maybe this should live in _conf?
    self.tmpl = {}
    self.tmpl.dialog = _.template('\
        <div class="schn_dialog">\
            <div class="schn_titlebar">\
                <span class="schn_title"><%= title %></span>\
                <a class="schn_close">x</a>\
            </div>\
            <div class="schn_content">\
            </div>\
        </div>')
        
    //dom elems go here
    self.dom = {}
    self.dom.dialog = null
    self.dom.content = null
    //event support
    self.evts = {}
    self.evts.fire = function() {}
    //the controller
    self.ctrl = {}
    //the view
    self.view = {}
    
    //set dialog content
    self.view.set_content = function(content) {
        self.dom.content.html(content)
        self.ctrl.init_content()
        return self
    }
    
    //set dialog title
    self.view.set_title = function(title) {
        self.dom.dialog.find('.schn_title').html(title)
        return self
    }
    
    //set draggability
    self.view.draggable = function(draggable) {
        if (draggable) {
            self.dom.dialog.draggable({ stack: ".schn_dialog" })
        } else {
            self.dom.dialog.draggable('destroy')
        }
        return self
    }
    
    //set resizability
    self.view.resizable = function(resizable) {
        if (resizable) {
            self.dom.dialog.resizable()
        } else {
            self.dom.dialog.resizable('destroy')
        }
        return self
    }
    
    //close and cleanup
    self.ctrl.close = function() {
        self.evts.fire('pre_close')
        self.dom.dialog.remove()
        self.evts.fire('post_close')
        return self
    }
    
    //initialize dialog view
    self.ctrl.init_view = function() {
        self.dom.dialog.find('.schn_close').click(function() {
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
        
        return self
    }
    
    //display the dialog ... normally called just once
    self.display = function() {
        self.dom.dialog = $(self.tmpl.dialog({
            title: ''
        }))
        self.dom.content = self.dom.dialog.find('.schn_content')
        $(document.body).append(self.dom.dialog)
        self.ctrl.init_view()
        return self
    }
    
    return self
}

