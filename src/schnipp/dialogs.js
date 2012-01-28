/*
the schnippdialog
organizing your javascript spaghetti since January 2012 ;)
*/

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

//generic clickhandlers
schnipp.dialogs._handlers = {}

//handler to open up a dialog
schnipp.dialogs._handlers.create_dialog = function(parent) {
    return function() {
        var clicked_link = $(this)
        var href = clicked_link.attr('href')
        $.get(
            href,
            function(data) {
                var dialog = schnipp.dialogs.dialog(parent)
                dialog.display()
                dialog.view.set_content($(data))
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
        $.get(
            href,
            function(data) {
                current_dialog.view.set_content($(data))
            }
        )
        return false
    }
}

//handler to post a form and load the response in the current dialog
schnipp.dialogs._handlers.submit_to_current_dialog = function(current_dialog) {
    
    return function() {
        var form = $(this)
        return schnipp.net.post_form(
            form,
            function(data) {
                current_dialog.view.set_content($(data))
            }
        )
    }
}

//handler to post a form and load the response in a new dialog
schnipp.dialogs._handlers.submit_to_new_dialog = function(parent) {
    
    return function() {
        var form = $(this)
        return schnipp.net.post_form(
            form,
            function(data) {
                var dialog = schnipp.dialogs.dialog(parent)
                dialog.display()
                dialog.view.set_content($(data))
            }
        )
    }
}

//enable dialog support for a dom elem and descendants
schnipp.dialogs.enable_for = function(elem, dialog) {
    if (!dialog)
        dialog = null
    //enable opening dialogs
    elem.find(schnipp.dialogs._conf.selectors.dialog_opener).click(
        schnipp.dialogs._handlers.create_dialog(self)
    )
    //enable reloading in current dialog
    elem.find(schnipp.dialogs._conf.selectors.dialog_setter).click(
        schnipp.dialogs._handlers.set_dialog_content(dialog)
    )
    //enable form posting to current dialog
    elem.find(schnipp.dialogs._conf.selectors.dialog_submit_setter).submit(
        schnipp.dialogs._handlers.submit_to_current_dialog(dialog)
    )
    //enable form posting to new dialog
    elem.find(schnipp.dialogs._conf.selectors.dialog_submit_opener).submit(
        schnipp.dialogs._handlers.submit_to_new_dialog(dialog)
    )
}
