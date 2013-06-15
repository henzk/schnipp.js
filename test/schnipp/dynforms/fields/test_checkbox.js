module('schnipp.dynforms.fields.checkbox')

test('render view of checkbox field', function() {
    var obj = schnipp.dynforms.fields.checkbox(
        {
            label: 'Testlabel',
            name: 'testname'
        },
        true
    )
    var rendered = obj.render()
    obj.initialize()
    equal('checkbox', rendered.find('input').attr('type'), 'input type is checkbox')
    equal('testname', rendered.find('input').attr('name'), 'input name is testname')
    equal(true, obj.dom.input.prop('checked'), 'checkbox is set')
    ok(rendered.text().substr('Testlabel'), 'view contains label')
})

test('get set clear', function() {
    var obj = schnipp.dynforms.fields.checkbox(
        {
            label: 'Testlabel',
            name: 'testname'
        },
        false
    )
    var rendered = obj.render()
    obj.initialize()
    equal(false, obj.dom.input.prop('checked'), 'checkbox is unchecked')
    equal(false, obj.get_data(), 'field value is false')

    obj.set_data(true)
    equal(true, obj.dom.input.prop('checked'), 'checkbox is checked')
    equal(true, obj.get_data(), 'field value is true')

    obj.clear()
    equal(false, obj.dom.input.prop('checked'), 'checkbox is unchecked')
    equal(false, obj.get_data(), 'field value is false')

    obj.dom.input.prop('checked', true)
    equal(true, obj.dom.input.prop('checked'), 'checkbox is checked')
    equal(true, obj.get_data(), 'checkbox is checked')

})