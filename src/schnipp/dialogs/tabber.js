
schnipp.dialogs.tabber = function(parent, component_name) {
    var self = schnipp.dialogs.component(parent, component_name)
    self.ui_type='tabber'
    
    self.tmpl.main = _.template('\
        <div data-schnui="tabber" class="schn_tabs">\
            <div class="schn_tabbar">\
            </div>\
            <div class="schn_tabcontent">\
            </div>\
            <div class="schn_tabtmpls" style="display:none">\
            </div>\
        </div>')
        
    self.dom.content = null
    
    //set dialog content
    self.view.set_content = function(content) {
        self.dom.content.html(content)
        self.ctrl.init_content()
        return self
    }
    
    self.view._select = function(elem) {
        self.dom.tabbar.find('a').removeClass('current')
        elem.addClass('current')
    }
    
    self.ctrl._loadcontent = function(tabhead_elem) {
        var inline_tab = tabhead_elem.attr('data-inlinetab')
        if (inline_tab) {
            var inline_tabcontent = self.dom.tabtmpls.find('[data-inlinetab="' + inline_tab + '"]')
            self.view.set_content(inline_tabcontent.html())
            return
        }
        var remote_tab = tabhead_elem.attr('data-remotetab')
        if (remote_tab) {
            schnipp.net.get(
                remote_tab,
                function(data) {
                    self.view.set_content($(data))
                }
            )
            return
        }
    }
    
    //cleanup
    self.ctrl.do_cleanup = function() {
        self.dom.view.remove()
    }
    
    self._handlers = {
        tabselect: function() {
            var me = $(this)
            self.view._select(me)
            self.ctrl._loadcontent(me)
            return false
        }
    }
    
    //initialize dialog view
    self.ctrl.init_view = function() {
        self.dom.tabbar.find('a').click(self._handlers.tabselect)
        return self
    }
    
    self.do_register_elems = function() {
        self.dom.tabbar = self.dom.view.children('.schn_tabbar')
        self.dom.content = self.dom.view.children('.schn_tabcontent')
        self.dom.tabtmpls = self.dom.view.children('.schn_tabtmpls')
    }
    
    //initialize dialog content
    self.ctrl.init_content = function() {
        console.log('init_content', self, self.dom.content)
        schnipp.dialogs.enable_for(self.dom.content, self)
        schnipp.dialogs._bootstrapper.fire_and_unbind('bootstrap', self)
        return self
    }
    
    //display the dialog ... normally called just once
    self.do_render = function() {
        var view = $(self.tmpl.main({
            title: ''
        }))
        self.dom.content = view.find('.schn_content')
        return view
    }
    
    return self
}

schnipp.dialogs._component_types['tabber'] = schnipp.dialogs.tabber
