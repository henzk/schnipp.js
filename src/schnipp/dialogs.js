/**
 *  @namespace
 *  @description
 *  nestable dialog components
 **/
schnipp.dialogs = {}
schnipp.dialogs._bootstrapper = schnipp.events.event_support()
schnipp.dialogs.bootstrap = function(cb) {
    schnipp.dialogs._bootstrapper.bind('bootstrap', cb)
}

//selector config
schnipp.dialogs._conf = {
    selectors: {
        dialog_opener: 'a.dialogbox, [data-dialogbox]',
        dialog_setter:'a.dialoglink, [data-dialoglink]',
        dialog_submit_setter:'form.ajax, form[data-dialogtarget="current"]',
        dialog_submit_opener:'form.dialogbox, form[data-dialogtarget="new"]',
        dialog_title:'[data-dialogtitle]'
    }
}

schnipp.dialogs._component_types = {}

schnipp.dialogs.get_component_of = function(dom_elem) {
    var comp_elem = dom_elem.closest('[data-schnui]')
    var comp = comp_elem.data('schnui-component')
    if (comp) {
        return comp
    } else {
        //console.log("PROBLEM: browser does not yield elems in preorder!!")
        throw 'Browser does not yield elems in preorder!! Needs workaround!!'
        //var parent_comp = schnipp.dialogs.get_component_of(comp_elem)
        //var comp_constructor = schnipp.dialogs._component_types[comp_elem.attr('data-schnui')]
        //return comp_constructor(parent, comp_elem.attr('data-schnui-name') || 'default')
    }
}

schnipp.dialogs.stack = {}
schnipp.dialogs.stack.max_index = 2000
schnipp.dialogs.stack.push_to_front = function() {
    //trivial implementation for now -- let's see how it goes
    $(this).css('z-index', ++schnipp.dialogs.stack.max_index)
}

//generic clickhandlers
schnipp.dialogs._handlers = {}

//handler to open up a dialog
schnipp.dialogs._handlers.create_dialog = function(parent) {
    return function() {
        var clicked_link = $(this)
        var href = clicked_link.attr('href')
        var dialog = schnipp.dialogs.dialog(parent)
        var form_success_event = clicked_link.attr('data-form-success-event')
        
        schnipp.net.get(
            href,
            function(data) {
                dialog.render()
                dialog.view.set_content($(data), href)
                // if data-dialog-align is specified
                dialog.align_to(clicked_link)
                if (form_success_event != undefined) {
                    dialog.dom.content.find('form').attr('data-form-success-event', form_success_event)
                }
                
            }
        )
        return false
    }
}

//handler to load stuff in the current dialog
schnipp.dialogs._handlers.set_dialog_content = function(current_dialog) {
    return function() {
        var clicked_link = $(this)
        var href = clicked_link.attr('href')
        current_dialog.ctrl.load(href)
        return false
    }
}

//handler to post a form and load the response in the current dialog
schnipp.dialogs._handlers.submit_to_current_dialog = function(current_dialog) {
       
    return function() {
        var form = $(this)
        var form_success_event = form.attr('data-form-success-event')
        var href = form.attr('action')
        return schnipp.net.post_form(
            form,
            function(data) {
                current_dialog.view.set_content($(data), href)
                if (form_success_event != undefined) {
                    current_dialog.dom.content.find('form').attr('data-form-success-event', form_success_event)
                }
            }
        )
    }
}

//handler to post a form and load the response in a new dialog
schnipp.dialogs._handlers.submit_to_new_dialog = function(parent) {
    
    return function() {
        var form = $(this)
        var href = form.attr('action')
        return schnipp.net.post_form(
            form,
            function(data) {
                var dialog = schnipp.dialogs.dialog(parent)
                dialog.render()
                dialog.view.set_content($(data), href)
            }
        )
    }
}

//enable dialog support for a dom elem and descendants
schnipp.dialogs._enable_for = function(elem, dialog) {
    
   
    if (!dialog)
        dialog = null
    //enable opening dialogs
 
    elem.undelegate(schnipp.dialogs._conf.selectors.dialog_opener, 'click')
    elem.delegate(schnipp.dialogs._conf.selectors.dialog_opener, 'click', schnipp.dialogs._handlers.create_dialog(dialog))
    
    //enable reloading in current dialog
    elem.find(schnipp.dialogs._conf.selectors.dialog_setter).unbind('click').click(
        schnipp.dialogs._handlers.set_dialog_content(dialog)
    )
    
    //enable form posting to current dialog
    elem.find(schnipp.dialogs._conf.selectors.dialog_submit_setter).unbind('submit').submit(
        schnipp.dialogs._handlers.submit_to_current_dialog(dialog)
    )
    //enable form posting to new dialog
    elem.find(schnipp.dialogs._conf.selectors.dialog_submit_opener).unbind('submit').submit(
        schnipp.dialogs._handlers.submit_to_new_dialog(dialog)
    )
    elem.find('[data-schnui]').each(function(index, comp_elem) {
        comp_elem = $(comp_elem)
        var comp_constructor = schnipp.dialogs._component_types[comp_elem.attr('data-schnui')]
        var comp = comp_constructor(dialog, comp_elem.attr('data-schnui-name') || 'default')
        comp.register_elems(comp_elem)
        comp.ctrl.init_content()
    })
}

//enable dialog support for a dom elem and descendants
schnipp.dialogs.enable_for = function(elem, dialog) {
    console.log(elem, dialog, 9999)

    if (!dialog)
        dialog = null
    //enable opening dialogs
    elem.find(schnipp.dialogs._conf.selectors.dialog_opener).unbind('click').click(
        schnipp.dialogs._handlers.create_dialog(dialog)
    )
    //enable reloading in current dialog
    elem.find(schnipp.dialogs._conf.selectors.dialog_setter).unbind('click').click(
        schnipp.dialogs._handlers.set_dialog_content(dialog)
    )
    
    //enable form posting to current dialog
    elem.find(schnipp.dialogs._conf.selectors.dialog_submit_setter).unbind('submit').submit(
        schnipp.dialogs._handlers.submit_to_current_dialog(dialog)
    )
    //enable form posting to new dialog
    elem.find(schnipp.dialogs._conf.selectors.dialog_submit_opener).unbind('submit').submit(
        schnipp.dialogs._handlers.submit_to_new_dialog(dialog)
    )
    elem.find('[data-schnui]').each(function(index, comp_elem) {
        comp_elem = $(comp_elem)
        var comp_constructor = schnipp.dialogs._component_types[comp_elem.attr('data-schnui')]
        var comp = comp_constructor(dialog, comp_elem.attr('data-schnui-name') || 'default')
        comp.register_elems(comp_elem)
        comp.ctrl.init_content()
    })
}

