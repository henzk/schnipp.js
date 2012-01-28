schnipp.net.post = $.post;

schnipp.net.post_form = function(form, on_success, on_error) {
    if (form.find(':file').length != 0) {
        schnipp.net._iframe_post(form, on_success, on_error);
        // important: DONT RETURN FALSE, OTHERWISE THE FORM WONT COMMIT
    } else {
        schnipp.net._ajax_post(form, on_success, on_error);
        return false;
    }
}

/*
 * Sends form data as serialized Array via POST
 */
schnipp.net._ajax_post = function(form, on_success, on_error) {
    schnipp.net.post(
        form.attr('action'),
        form.serializeArray(),
        /*_beforeSend: function() {
            // neccessary bugfix, as otherwise the form would be initialized
            // with the old form url, and not with the form url of the new form
            // loaded from the server
            var parent = form.parent();
            form.remove();
            display_loader(parent);         
        },*/
        function(response) {
           on_success(response)
        },
        'text'
    )
}

schnipp.net._iframe_seq = 1;

/*
 * Sends the form data in a invinsible Iframe. (Needed for
 * file-uploads).
 */
schnipp.net._iframe_post = function(form, on_success, on_error) {
    remoter_id = 'schnipp_remoter' + (schnipp.net._iframe_seq++);
    var iframe = schnipp.net._create_iframe(remoter_id)
    form.attr('target', remoter_id)
    
    iframe.unbind('load')
    iframe.load(function() {
        var a = $(iframe.contents().children()[0]) //Whats going on here?
        on_success(a.html())
        schnipp.net._unregister_iframe(iframe)
    })
}

/**
 * iframe garbage collector - removes the iframe from the DOM
 */
schnipp.net._unregister_iframe = function(iframe) {
    //wait a little
    setTimeout(function() {
        iframe.remove()
    }, 300)
}

/**
 *  creates an invisible iframe with id iid and name iname and adds it to the DOM
 *   - if iname is not given iid will be used for name also  
 */
schnipp.net._create_iframe = function(iid, iname) {
    if (iname == undefined)
        iname = iid
    var iframe
    try {
        // IE HACK
        iframe = $.create('<iframe style="display:none;position: relative; left: -500px" name="' + iname +'" id="' + iid + '" src=""></iframe>',{})
    } catch (ex) {
        iframe = $('<iframe style="display:none;position: relative; left: -500px" name="' + iname +'" id="' + iid + '" src=""></iframe>')
    }
    iframe.appendTo(document.body)
    return iframe
}
