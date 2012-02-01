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
    
    //event support
    self.evts = schnipp.events.event_support()
    
    //the controller
    self.ctrl = {}
    //the view
    self.view = {}
    
    //initialize view
    self.ctrl.init_view = function() {}
    
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
    
    self.do_register_elems = function() {}
    
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
    
    self.do_render = function() {}
    
    return self
}
