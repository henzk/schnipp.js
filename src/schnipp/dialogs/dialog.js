schnipp.dialogs.dialog = function(parent, component_name) {
    
    var self = schnipp.dialogs.component(parent, component_name)
    self.ui_type='dialog'
    self.dom.content = null
    self.href = null
    
    self.tmpl.main = _.template('\
        <div data-schnui="dialog" class="schn_dialog">\
            <div class="schn_titlebar">\
                <span class="schn_title"><%= title %></span>\
                <a class="schn_close">x</a>\
            </div>\
            <div class="schn_content">\
            </div>\
        </div>')
    
    //self.tmpl.overlay = '<div class="schn_overlay"></div>'
        
        
    //set dialog content
    self.view.set_content = function(content, href) {
        self.href = href || null
        self.dom.content.html(content)
        self.ctrl.init_content()
        // set the width of the draggable dialog to prevent glue effect when right:0
        //self.dom.view.css('width', self.dom.content.width() + 'px')
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
            self.dom.view.draggable({
                start: schnipp.dialogs.stack.push_to_front,
                handle: '.schn_titlebar'
            }).click(schnipp.dialogs.stack.push_to_front)
                .trigger('click')
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
    
    self.ctrl.load = function(href) {
        schnipp.net.get(
            href,
            function(data) {
                self.view.set_content($(data), href)
            }
        )
    }
    
    self.ctrl.reload = function() {
        if (self.href != null)
            self.ctrl.load(self.href)
        else
            ;//console.log('unable to reload dialog ... self.href is null')
    }
    
    //cleanup
    self.ctrl.do_cleanup = function() {
        self.dom.view.remove()
    }
    
    //close action
    self.ctrl.close = self.ctrl.cleanup
    
    //initialize dialog view
    self.ctrl.init_view = function() {
        // store the initial scrollTop. This is especially important with
        // huge dialogs that reload themeselves. E.g. consider a
        // huge form, where the save button is on the bottom. To click this
        // button, the user must scroll down. When the dialog is re-rendered,
        // and the center method would pick the current scroll top position, the dialog's
        // top property would be that huge scrollTop. SO, WE STORE THE
        // SCROLLTOP WHEN THE DIALOG IS OPENED THE FIRST TIME. This value
        // is further used by the center method.
        self.initial_scroll_top = $(document).scrollTop() 
        
        self.dom.view.find('.schn_close').click(function() {
            self.ctrl.close()
        })
        
        // center dialog on resize
        $(window).resize(function() {
            self.center_dialog()
        })
        
        self.view.draggable(true)
        return self
    }
    
 
    // center the dialog   
    self.center_dialog = function() {
        /*var left = ($(document).width() - self.dom.view.width()) / 2
        var y_delta = $(window).height() - self.dom.view.height() 
        
        if (y_delta >= 0)
            var top = (y_delta) / 2
        else
            var top = 0
        
        
        if (self.dom.view.height() < $(window).height()) 
            top += $(document).scrollTop()
        //top += window.pageYOffset / 2
            
        self.dom.view.css({
            'top': top + 'px',
            'left': left + 'px'
        })*/
        
        var left = ($(document).width() - self.dom.view.width()) / 2
        var y_delta = $(window).height() - self.dom.view.outerHeight() 
        
        if ($(window).height() >= self.dom.view.height())
            var top = (y_delta / 2) + $(document).scrollTop() 
        else
            var top = self.initial_scroll_top

        self.dom.view.css({
            'top': top + 'px',
            'left': left + 'px'
        })
    }
    
    
    
    //initialize dialog content
    self.ctrl.init_content = function() {
        //set title
        self.center_dialog()
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
