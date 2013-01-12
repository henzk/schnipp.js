schnipp.dialogs.component = function(parent, component_name) {
    var self = {}
    self.ui_type='component'
    //parent component
    self.parent = parent
    //set name with 'default' as fallback
    self.name = component_name
    if (!self.name) {
        self.name = 'default'
    }
    
    //subcomponents
    self.children = {}
    
    //template stuff ... maybe this should live in _conf?
    self.tmpl = {}
    self.tmpl.main = null
    
    //dom elems go here
    self.dom = {}
    self.dom.view = null
    self.dom.content = null
    self.dom.overlay = null
    
    //event support
    self.evts = schnipp.events.event_support()
    
    //the controller
    self.ctrl = {}
    //the view
    self.view = {}

    //set dialog content
    self.view.set_content = function(content, href) {
        self.href = href || null
        self.dom.content.html(content)
        self.ctrl.init_content()
        return self
    }
    
    //initialize view
    self.ctrl.init_view = function() {}
    
        //initialize dialog content
    self.ctrl.init_content = function() {
        schnipp.dialogs.enable_for(self.dom.content, self)
        schnipp.dialogs._bootstrapper.fire_and_unbind('bootstrap', self)
        return self
    }
    
    //close and cleanup
    self.ctrl.cleanup = function() {
        self.evts.fire('pre_cleanup', self)
        self.ctrl.do_cleanup()
        self.evts.fire('post_cleanup', self)
        return self
    }
    
    //cleanup component
    self.ctrl.do_cleanup = function() {
        return self
    }
    
    self.do_register_elems = function() {
        self.dom.content = self.dom.view
    }
    
    self.register_elems = function(view) {
        self.dom.view = view;
        self.dom.view.data('schnui-component', self)
        self.do_register_elems()
        self.ctrl.init_view()
    }
    
    //render component ... normally called just once
    self.render = function(elem) {
        elem = elem || $(document.body)
        var view = self.do_render()
        elem.append(view)
        self.register_elems(view)
        return self
    }
    
    self.getattr = function(elem, attr) {
        attr = elem.attr(attr)
        if (typeof attr !== 'undefined' && attr !== false)
            return attr
        else
            return false
    }
   
    // align dialog to $link which is the triggering link
    self.align_to = function($link) {
        $link = $($link)
        var align_x = self.getattr($link, 'data-dialog-align-x')
        var align_y = self.getattr($link, 'data-dialog-align-y')
        var target = self.getattr($link, 'data-dialog-align-elem')
        
        if (target)
            var $target = $(target)
        else
            var $target = $link
        
        if (  align_x || align_y ) {
                        
            if (!align_x) align_x = 'left' 
            if (!align_y) align_y = 'top'
            
            var e_top = $target.offset().top
            var e_left =  $target.offset().left
            var e_height = $target.outerHeight()
            var e_width = $target.outerWidth()
           
            var css = {}
            if (align_y == 'top')
                css.top = e_top + 'px'
            else if (align_y == 'bottom')
                css.top = e_top + e_height + 'px'
              
            if (align_x == 'left') {
                var dialog_right = $(window).width() - e_left
                css.right = dialog_right + 'px'
                css.left = 'inherit'
            } else if (align_x == 'right') {
                css.left = e_left + e_width + 'px'
                
            }
            self.dom.view.addClass('cmp_aligned')
            self.dom.view.css(css)
        }        
    }
    
    self.do_render = function() {}
    
    return self
}
schnipp.dialogs._component_types['component'] = schnipp.dialogs.component
