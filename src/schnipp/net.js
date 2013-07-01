/**
 * Network and AJAX helpers.
 * @static
 * @class schnipp.net
 * @module schnipp.net
 **/
schnipp.net = {}

/**
 * Sends a GET request.
 *
 * @param {string} url The request URL
 * @param {string} data The post data
 * @param {Function} Callback to be executed on success
 * @param {string} type The type of data expected from the server. Per Default, type is an intelligent guess (--> jQuery)
 * @method get
 **/
schnipp.net.get = function (url, data, callback, type) {
    // shift arguments if data argument was omitted
    if ($.isFunction(data)) {
        type = type || callback
        callback = data
        data = {}
    }
    schnipp.spinner.show()
    
    return $.get(
        url,
        data,
        function(data, textStatus, jqXHR) {
            callback(data, textStatus, jqXHR)
            schnipp.spinner.hide()
        },
        type
    ).error(schnipp.net.error_handler)
}

/**
 * Sends a post request.
 *
 * @param {string} url The request URL
 * @param {string} data The post data
 * @param {Function} Callback to be executed on success
 * @param {string} type The type of data expected from the server. Per Default, type is an intelligent guess (--> jQuery)
 * @method post
 **/
schnipp.net.post = function (url, data, callback, type) {
    // shift arguments if data argument was omitted
    if ($.isFunction(data)) {
        type = type || callback
        callback = data
        data = {}
    }
    schnipp.spinner.show()
    
    return $.post(
        url,
        data,
        function(data, textStatus, jqXHR) {
            callback(data, textStatus, jqXHR)
            schnipp.spinner.hide()
        },
        type
    ).error(schnipp.net.error_handler)
}

/**
 * AJAX error handler.
 *
 * @param {object} jqXHR The jQuery XHR object
 * @param {string} textStatus The http error status
 * @param {string} errorThrown The text portion of the http error status
 * @method error_handler
 **/
schnipp.net.error_handler = function(jqXHR, textStatus, errorThrown) {
    alert('Sorry, a network error has occured!\n You may have to reload the page.')
}


schnipp.net._iframe_seq = 1;

 
/**
 * Sends the form data in a invinsible Iframe for file-uploads.
 *
 * @param {dom node} form The jQuery form node
 * @param {function} on_success The success callback
 * @param {function} on_error The error callback
 **/
schnipp.net._iframe_post = function(form, on_success, on_error) {
    remoter_id = 'schnipp_remoter' + (schnipp.net._iframe_seq++);
    var iframe = schnipp.net._create_iframe(remoter_id)
    form.attr('target', remoter_id)
    
    iframe.unbind('load')
    iframe.load(function() {
        var a = $(iframe.contents().children()[0]) //Whats going on here?
        on_success(a.html())
        schnipp.net._unregister_iframe(iframe)
        schnipp.net._trigger_form_success_events(form)
        schnipp.spinner.hide()
    })
}

/**
 * Iframe garbage collector - removes the iframe from the DOM
 * @param {dom node} iframe The iframe as jQuery dom node
 **/
schnipp.net._unregister_iframe = function(iframe) {
    //wait a little
    setTimeout(function() {
        iframe.remove()
    }, 300)
}

/**
 * Creates an invisible iframe with id iid and name iname and adds it to the DOM
 *  - if iname is not given iid will be used for name also 
 * @param {string} iid The unique iframe id
 * @param {string} iname The iframe name  
 **/
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
