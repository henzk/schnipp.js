module('schnipp.dynforms.fields.textarea')

test('render view of textarea field', function() {
    var obj = schnipp.dynforms.fields.textarea(
        {
            label: 'Testlabel',
            name: 'testname'
        },
        'hello'
    )
    var rendered = obj.render()
    obj.initialize()
    equal('hello', obj.dom.input.val(), 'input value is hello')
    equal('testname', rendered.find('textarea').attr('name'), 'textarea name is testname')
    ok(rendered.text().substr('Testlabel'), 'view contains label')
})

test('get set clear', function() {
    var obj = schnipp.dynforms.fields.textarea(
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