function inject_css(filename){
  var fileref=document.createElement("link")
  fileref.setAttribute("href", filename)
  fileref.setAttribute("rel", "stylesheet")
  fileref.setAttribute("type", "text/css")
  document.getElementsByTagName("head")[0].appendChild(fileref)
}
(function() {
  inject_css('http://code.jquery.com/qunit/qunit-1.11.0.css')
  var qunit_div = document.createElement("div")
  qunit_div.setAttribute("id", "qunit")
  var qunit_fixture_div = document.createElement("div")
  qunit_fixture_div.setAttribute("id", "qunit-fixture")
  document.body.insertBefore(qunit_fixture_div, document.body.firstChild)
  document.body.insertBefore(qunit_div, document.body.firstChild)
})()