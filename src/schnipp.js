/**
 *  @fileOverview
 *  schnipp.js - javascript framework
 *  https://github.com/henzk/schnipp.js
 *  License: MIT
 *  @author http://schnapptack.de/
 *
 *  @description
 *  schnipp.js javascript framework
 *  <br>
 *  The project can be found online at 
 *  <a href="https://github.com/henzk/schnipp.js">
 *  https://github.com/henzk/schnipp.js</a>.
 **/

/**
 *  @namespace
 *  @description
 *  schnipp.js javascript framework main module
 **/
var schnipp = {};


/**
 *  @namespace
 *  @description
 *  simple busy indicator
 **/
schnipp.spinner = {}


/**
 *  show busy indicator
 **/
schnipp.spinner.show = function() {
    var dom_elem = $('#spinner')
    if (!dom_elem.length) {
        dom_elem = $('<div id="spinner"><img src="/static/schnipp/ajax_loader.gif"></div>')
        $(document.body).append(dom_elem)
    }
    dom_elem.show()
}


/**
 *  hide busy indicator
 **/
schnipp.spinner.hide = function() {
    $('#spinner').hide()
}
