
schnipp.ui.dialog_count = 0
/**
 * @constructor
 * @description
 * The schnipp dialog.
 **/
schnipp.ui.Dialog = function() {

    var self = {}
    self.events = schnipp.events.event_support()
    self.dom = {}
    self.dom.main = $('\
        <div class="schnipp-dialog">\
            <div class="schnipp-dialog-inner">\
                <a class="schnipp-dialog-close">close</a>\
                <div class="schnipp-dialog-header"></div>\
                <div class="schnipp-dialog-content"</div>\
            </div>\
        </div>\
    ')
    self.dom.content = self.dom.main.find('.schnipp-dialog-content')
    self.dom.header = self.dom.main.find('.schnipp-dialog-header')
    self.dom.close = self.dom.main.find('.schnipp-dialog-close')
    self._zindex = 1


    /**
     * The constructor containing the controler code binding events and appending
     * the dialog dom node to document. 
     **/
    self.init = function() {
        self.dom.close.click(self.close)
        self.dom.main.click(self.focus)
        $('body').append(self.dom.main)
        schnipp.ui.dialog_count += 1
        
        self.dom.main.css('z-index', self.dom.main.css('z-index') + schnipp.ui.dialog_count)
        return self
    }
    
    /**
     * Sets the content of the dialog. Triggers a content-change event on the dialog instance.
     *
     * @param {string} content The content that is set.
     **/
    self.set_content = function(content) {
        self.dom.content.empty()
        self.dom.content.append(content)
        self._center()
        self.events.fire('content-change', {
            evt: 'content-change',
            dialog: self,
            content: content
        })
    }  
      
    /**
     * Sets the title of the dialog. 
     * Triggers a title-change event on the dialog instance.
     *
     * @param {string} title The title that is set.
     **/
    self.set_title = function(title) {
        self.dom.header.empty()
        self.dom.header.addClass('dialog-has-title')
        self.dom.header.append(title)
        self.events.fire('title-change', {
            evt: 'title-change',
            dialog: self,
            content: title
        })
    }  
    
    /**
     * Shows the dialog if its display attribute is none. 
     * Triggers a show event on the dialog instance.
     **/    
    self.show = function() {
        self.events.trigger('show')
        self.dom.main.show()
        self.events.fire('show', {
            evt: 'show',
            dialog: self
        })
    }
    
    /**
     * Closes and destroys the dialog of the dialog. Triggers a closes event on the dialog instance.
     **/
    self.close = function() {
        self.events.trigger('close')
        self.dom.main.remove()
        self.events.fire('close', {
            evt: 'close',
            dialog: self
        })
    }
    
    /**
     * Private function to center the dialog. 
     **/
    self._center = function() {
        var top = self.dom.main.offset().top
        var left = self.dom.main.offset().left
        var width = self.dom.main.width()
        var height = self.dom.main.height()
        
        var window_width = $(window).width()
        var window_height = $(window).height()
        
        var new_top = (window_height - height) / 2
        var new_left = (window_width - width) / 2
        
        self.dom.main.css({'top': new_top + 'px', 'left': new_left + 'px'})    
    }

    /**
     * Sets the dialog on top (z-index) of all other dialogs. Triggers a focus event 
     * on the dialog instance.
     **/
    self.focus = function() {
        var zindexes = []
        $('.schnipp-dialog').each(function() {
            zindexes.push(parseInt($(this).css('z-index')))
        })
        
        var new_index = Math.max.apply(null, zindexes) + 1
        self.dom.main.css('z-index', new_index)
        self.events.fire('focus', {
            evt: 'focus',
            dialog: self
        })
    }

    return self
}

