schnipp.dialogs.tabber = function(parent, component_name) {
    var self = schnipp.dialogs.component(parent, component_name)
    self.toplevel_ajax_component = false
    self.current_tabhead = null
    self.ui_type = 'tabber'
    
    self.tmpl.main = _.template('\
        <div data-schnui="tabber" class="schn_tabs">\
            <div class="schn_tabbar">\
            </div>\
            <div class="schn_tabcontent">\
            </div>\
        </div>')
        
    self.dom.content = null
    
    //set dialog content
    self.view.set_content = function(content) {
        self.toplevel_ajax_component = true
        self.dom.remote.html(content)
        self.view._activate_tab(self.dom.remote)
        return self
    }
    
    self.view._select = function(elem) {
        self.dom.tabbar.find('a').removeClass('current')
        elem.addClass('current')
        self.current_tabhead = elem
    }
    
    self.view._activate_tab = function(elem) {
        self.dom.tabcontent.children().hide()
        self.dom.content = elem
        elem.show()
        if (elem.hasClass('remote'))
            elem.data('schn-inited', false)
        if (!elem.data('schn-inited')) {
            self.ctrl.init_content()
            elem.data('schn-inited', true)
        }
    }
    
    self.view.activate_tab = function(index) {
        var links = self.dom.tabbar.find('a')
        var thelink = $(links[index])
        thelink.click()
    }
    
    self.ctrl.reload = function() {
        if (self.current_tabhead != null)
            self.current_tabhead.click()
        else
            ;//console.log('unable to reload dialog ... self.href is null')
    }
    
    self.ctrl._loadcontent = function(tabhead_elem) {
        var inline_tab = tabhead_elem.attr('data-inlinetab')
        if (inline_tab) {
            var inline_tabcontent = self.dom.tabcontent.find('[data-inlinetab="' + inline_tab + '"]')
            self.view._activate_tab(inline_tabcontent)
            return
        }
        var remote_tab = tabhead_elem.attr('data-remotetab')
        if (remote_tab) {
            schnipp.net.get(
                remote_tab,
                function(data) {
                    var content = $(data)
                    self.view.set_content(content)
                    //$(document).trigger('dom-changed')
                }
            )
            return
        }
    }
    
    self.ctrl.add_inlinetab = function(key, title, content) {
        var tablink = $('<a data-inlinetab="' + key + '">' + title + '</a>')
        self.dom.tabbar.append(tablink)
        var tabcontent = $('<div data-inlinetab="' + key + '"></div>')
        self.dom.tabcontent.append(tabcontent)
        tabcontent.append(content)
        self.ctrl.init_view()
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
        self.dom.tabbar.find('a').unbind('click').click(self._handlers.tabselect)
        return self
    }
    
    //register elems
    self.do_register_elems = function() {
        self.dom.tabbar = self.dom.view.children('.schn_tabbar')
        self.dom.tabcontent = self.dom.view.children('.schn_tabcontent')
        self.dom.remote = self.dom.tabcontent.children('.remote')
        if (!self.dom.remote.length) {
            self.dom.remote = $('<div class="remote"/>')
            self.dom.tabcontent.append(self.dom.remote)
        }
        self.view._activate_tab(self.dom.tabcontent.children(':first'))
        self.scope = self.dom.view.attr('data-schnui-scope') || null;
    }
    
    //initialize dialog content
    self.ctrl.init_content = function() {
        schnipp.dialogs.enable_for(self.dom.content, self)
        if (self.toplevel_ajax_component) {
            schnipp.dialogs._bootstrapper.fire_and_unbind('bootstrap', self)
            self.toplevel_ajax_component = false
        }
        return self
    }
    
    //display the dialog ... normally called just once
    self.do_render = function() {
        var view = $(self.tmpl.main())
        return view
    }
    
    return self
}

schnipp.dialogs._component_types['tabber'] = schnipp.dialogs.tabber
