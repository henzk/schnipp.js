schnipp.net.get = function (url, data, callback, type) {
    // shift arguments if data argument was omitted
    if ($.isFunction(data)) {
        type = type || callback;
        callback = data;
        data = {};
    }
    schnipp.spinner.show()
    //return false
    return $.get(
        url,
        data,
        function(data, textStatus, jqXHR) {
            callback(data, textStatus, jqXHR)
            $(document).trigger('dom-changed')
            schnipp.spinner.hide()
        },
        type
    ).error(schnipp.net.error_handler)
}
