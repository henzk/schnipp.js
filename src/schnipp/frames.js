/*
schnipp frames - rockit
*/
schnipp.frames = {}


schnipp.frames._handlers = {}

schnipp.frames._handlers.create_frame = function(parent, clicked_link) {
    var href = clicked_link.attr('href')
    $.get(
        href,
        function(data) {
            var content = $(data)
            var frame = schnipp.frames.frame('myframe', parent)
            frame.display()
            frame.view.set_content(content)
            var title = ''
            var title_elem = content.find('[data-frametitle]')
            if (title_elem.length) {
                title = title_elem.attr('data-frametitle')
                title_elem.remove()
            }
            frame.view.set_title(title)
        }
    )
}
/*
the schnippframe
organizing your javascript spaghetti since January 2012 ;)
*/
schnipp.frames.frame = function(framename, parent) {
    var self = {}
    
    self.name = framename
    self.parent = parent
    self.children = []
    self.tmpl = {}
    self.tmpl.frame = _.template('\
        <div class="schn_frame">\
            <div class="schn_titlebar">\
                <span class="schn_title"><%= title %></span>\
                <a class="schn_close">x</a>\
            </div>\
            <div class="schn_content">\
                <%= content %>\
            </div>\
        </div>')
        
    self.views = {}
    self.views.frame = null
    self.evts = {}
    self.evts.fire = function() {}
    self.ctrl = {}
    self.view = {}
    
    self.view.set_content = function(content) {
        self.views.frame.find('.schn_content').html(content)
        self.ctrl.init_content()
        return self
    }
    
    self.view.set_title = function(title) {
        self.views.frame.find('.schn_title').html(title)
        return self
    }
    
    self.view.draggable = function(draggable) {
        if (draggable) {
            self.views.frame.draggable()
        } else {
            self.views.frame.draggable('destroy')
        }
        return self
    }
    
    self.view.resizable = function(resizable) {
        if (resizable) {
            self.views.frame.resizable()
        } else {
            self.views.frame.resizable('destroy')
        }
        return self
    }
    
    self.ctrl.close = function() {
        self.evts.fire('pre_close')
        self.views.frame.remove()
        self.evts.fire('post_close')
        return self
    }
    
    self.ctrl.init_view = function() {
        self.views.frame.find('.schn_close').click(function() {
            self.ctrl.close()
        })
        self.view.draggable(true)
        return self
    }
    
    self.ctrl.init_content = function() {
        self.views.frame.find('.schn_content .newframe').click(
            schnipp.frames._handlers.create_frame(self, $(this))
        )
        return self
    }
    
    self.display = function() {
        self.views.frame = $(self.tmpl.frame({
            title: '',
            content: ''
        }))
        $(document.body).append(self.views.frame)
        self.ctrl.init_view()
        return self
    }
    
    return self
}

$(function() {
    var frame = schnipp.frames.frame('myframe', null)

    frame.display()
        .view.set_content('I am the content')
        .view.set_title('i am the title')
        .view.resizable(false)
})
