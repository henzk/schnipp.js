module('schnipp.dynforms.fields.text')

test('render view of text field', function() {
    var obj = schnipp.dynforms.fields.text(
        {
            label: 'Testlabel',
            name: 'testname'
        },
        'hello'
    )
    var rendered = obj.render()
    obj.initialize()
    equal('hello', obj.dom.input.val(), 'input value is hello')
    equal('testname', rendered.find('input').attr('name'), 'input name is testname')
    ok(rendered.text().substr('Testlabel'), 'view contains label')
})

test('get set clear', function() {
    var obj = schnipp.dynforms.fields.text(
        {
            label: 'Testlabel',
            name: 'testname'
        },
        'hello'
    )
    var rendered = obj.render()
    obj.initialize()
    equal('hello', obj.dom.input.val(), 'input value is hello')
    equal('hello', obj.get_data(), 'field value is hello')

    obj.set_data('goodbye')
    equal('goodbye', obj.dom.input.val(), 'input value is goodbye')
    equal('goodbye', obj.get_data(), 'field value is goodbye')

    obj.clear()
    equal('', obj.dom.input.val(), 'input value is empty str')
    equal('', obj.get_data(), 'field value is empty str')

})