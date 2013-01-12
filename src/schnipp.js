var schnipp = {};

schnipp.spinner = {}

schnipp.spinner.show = function() {
    var dom_elem = $('#spinner')
    if (!dom_elem.length) {
        dom_elem = $('<div id="spinner"><img src="/static/schnipp/ajax_loader.gif"></div>')
        $(document.body).append(dom_elem)
    }
    dom_elem.show()
}

schnipp.spinner.hide = function() {
    $('#spinner').hide()
}
