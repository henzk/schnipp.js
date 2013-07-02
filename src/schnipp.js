/**
 * schnipp.js - javascript framework
 *
 * The project can be found online at
 * <a href="https://github.com/henzk/schnipp.js">
 * https://github.com/henzk/schnipp.js</a>.
 *
 * License: MIT
 * @module schnipp
 * @author http://schnapptack.de/
 **/
var schnipp = {}


/**
 * simple busy indicator
 *
 * @static
 * @class schnipp.spinner
 **/
schnipp.spinner = {}


/**
 * show busy indicator
 * @method show
 **/
schnipp.spinner.show = function() {
    var dom_elem = $('#schnipp-spinner')
    if (!dom_elem.length) {
        dom_elem = $('<div id="schnipp-spinner"></div>')
        $(document.body).append(dom_elem)
    }
    dom_elem.show()
}


/**
 * hide busy indicator
 * @method hide
 **/
schnipp.spinner.hide = function() {
    $('#schnipp-spinner').hide()
}


/**
 * truncates a string by <len> chars
 * @method truncate
 **/
schnipp.truncate = function(str, len) {
    if (str.length > len)
        return $.trim(str).substring(0, len) + '...'
    else
        return str
}

/**
 * Enables inline editing of <elem> on the basis of <obj> (entity).
 * Inserts a form on dblclick and saves that form on enter or blur.
 * @method enable_inline_editing
 **/
schnipp.enable_inline_editing = function(elem, obj, get_filter, set_filter) {

    get_filter = get_filter || function(obj) {return obj.get('name')}
    set_filter = set_filter || function(val, obj) {return val}

    var parent = elem.parent()
    var form = null
    var input = null

    elem.click(function() {return false})
    elem.unbind('dblclick')
    elem.dblclick(function() {
        elem.css('visibility', 'hidden')
        form = $('<form class="inline-edit-form"><input type="text"/></form>')
        input = form.find('input')
        parent.append(form)
        input.focus()
        input.val(get_filter(obj))
        input.select()
        //self.dom.main.disableSelection()
        input.blur(function() {
            form.trigger('submit')
        })
        
        form.submit(function() {
            obj.set('name', set_filter(input.val(), obj))
            obj.save()
            //$('body').disableSelection()
            form.remove()
            elem.css('visibility', 'visible')
            form = null
            input = null
            return false
        })
        return false
    })
    
    $(document).click(function() {
        if (form && input) {
            form.trigger('submit')
        }
        
    })
}

/**
* Enables inline editing with taking file endings into account.
* The file ending will not be editable.
* @method enable_file_inline_editing
*/
schnipp.enable_file_inline_editing = function(domelem, obj) {
    var get_filter = function(obj) {
        return obj.get('name').split('.')[0]
    }
    var set_filter = function(val, obj) {
        return val + '.' + obj.get('name').split('.')[1]
    }
    schnipp.enable_inline_editing(domelem, obj, get_filter, set_filter)
    
}
