/*
the schnippdialog
organizing your javascript spaghetti since January 2012 ;)
*/

schnipp.dialogs = {}

//selector config
schnipp.dialogs._conf = {
    selectors: {
        dialog_opener: 'a.dialogbox, [data-dialogbox]',
        dialog_setter:'a.dialoglink, [data-dialoglink]',
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
    
}

