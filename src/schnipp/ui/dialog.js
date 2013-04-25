
schnipp.ui.dialog = function() {

    var self = {}
    self.dom = {}
    self.dom.main = $('\
        <div class="schnipp-dialog">\
            <a class="schnipp-dialog-close">close</a>\
            <div class="schnipp-dialog-header"></div>\
            <div>class="schnipp-dialog-content"</div>\
        </div>\
    ')
    self.dom.content = self.dom.main.find('.dialog-content')
    self.dom.header = self.dom.main.find('.dialog-header')
    self.dom.close = self.dom.main.find('.dialog-close')

    
    self.init = function() {
        self.dom.close.click(self.close)
        self.dom.main.click(self.top_dialog)
        return self
    }
    
    self.set_content = function(content) {
        self.dom.content.empty()
        self.dom.content.append(content)
        self.center()
    }  
      
    
    self.set_title = function(title) {
        self.dom.header.empty()
        self.dom.header.append(title)
    }  
    
    
    self.open = function() {
        self.events.trigger('open')
        self.dom.main.show()
    }
    
    
    self.close = function() {
        self.events.trigger('close')
        self.dom.main.hide()
    }
    
    self.destroy = funtion() {
        self.events.trigger('destroy')
        self.dom.main.remove()
    }
    
    // ----------------
    
    self.center = function() {
        var top = self.dom.main.offset().top
        var left = self.dom.main.offset().left
        var width = self.dom.main.width()
        var height = self.dom.main.height()
        
        var window_width = $(window).width()
        var window_height = $(window).height()
        
        var new_top = window_height - height / 2
        var new_left = window_width - width / 2
        
        self.dom.main.css({'top': new_top + 'px', 'left': new_left + 'px'})    
    }
    
    self.top_dialog = function() {
        var zindexes = []
        $('.schnipp-dialog').each(function() {
            zindexes.push(parseInt($(this).css('z-index')))
        })
        
        var new_index = Math.max.apply(null, zindexes) + 1
        self.dom.main.css('z-index', new_index)
    }

    return self
}

