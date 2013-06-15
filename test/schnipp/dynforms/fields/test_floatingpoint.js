module('schnipp.dynforms.fields.floatingpoint')

test('render view of floatingpoint field', function() {
    var obj = schnipp.dynforms.fields.floatingpoint(
        {
            label: 'Testlabel',
            name: 'testname'
        },
        2.78
    )
    var rendered = obj.render()
    obj.initialize()
    equal(obj.dom.input.val(), '2.78', 'input value is 2.78')
    equal(rendered.find('input').attr('name'), 'testname', 'input name is testname')
    ok(rendered.text().substr('Testlabel'), 'view contains label')
})

test('get set clear', function() {
    var obj = schnipp.dynforms.fields.floatingpoint(
        {
            label: 'Testlabel',
            name: 'testname'
        },
        2.78
    )
    var rendered = obj.render()
    obj.initialize()
    equal(obj.dom.input.val(), '2.78', 'input value is 2.78')
    equal(obj.get_data(), 2.78, 'field value is 2.78')

    obj.set_data(3.14)
    equal(obj.dom.input.val(), '3.14', 'input value is 3.14')
    equal(obj.get_data(), 3.14, 'field value is 3.14')

    obj.clear()
    equal(obj.dom.input.val(), '', 'input value is empty str')
    ok(isNaN(obj.get_data()), 'field value is NaN')
})

test('test localize', function() {
    var obj = schnipp.dynforms.fields.floatingpoint(
        {
            label: 'Testlabel',
            name: 'testname',
            float_separator: ','
        },
        2.78
    )
    var rendered = obj.render()
    obj.initialize()
    equal(obj.dom.input.val(), '2,78', 'input value is 2,78')
    equal(obj.get_data(), 2.78, 'field value is 2.78')

    obj.set_data(3.14)
    equal(obj.dom.input.val(), '3,14', 'input value is 3,14')
    equal(obj.get_data(), 3.14, 'field value is 3.14')

    obj.clear()
    equal('', obj.dom.input.val(), 'input value is empty str')
    ok(isNaN(obj.get_data()), 'field value is NaN')
})