module('schnipp.dynforms.primitive_field')

test('render container of primitive field', function() {
    var schema = {
        label: 'Testlabel',
        name: 'testname'
    }
    var obj = schnipp.dynforms.primitive_field(
        schema,
        ''
    )
    equal(obj.dom.main, null, 'dom main is null')
    var input = $('<input type="text" name="test" value="">')
    var rendered = obj.render_container(schema, input)
    equal('test', rendered.find('input').attr('name'), 'rendered container contains input elem')
    ok(rendered.text().substr('Testlabel'), 'container contains label')
})

test('render container of primitive field without label', function() {
    var schema = {
        name: 'testname'
    }
    var obj = schnipp.dynforms.primitive_field(
        schema,
        ''
    )
    equal(obj.dom.main, null, 'dom main is null')
    var input = $('<input type="text" name="test" value="">')
    var rendered = obj.render_container(schema, input)
    equal('test', rendered.find('input').attr('name'), 'rendered container contains input elem')
    ok(!rendered.find('label').length, 'container contains no label')
})

test('render view of primitive field', function() {
    var obj = schnipp.dynforms.primitive_field(
        {
            label: 'Testlabel',
            name: 'testname'
        },
        ''
    )
    equal(obj.dom.main, null, 'dom main is null')
    obj.dom.input = $('<input type="text" name="test" value="">')
    var rendered = obj.render()
    obj.initialize()
    equal('test', rendered.find('input').attr('name'), 'view contains input elem')
    ok(rendered.text().substr('Testlabel'), 'view contains label')
})

test('get, set, clear', function() {
    var obj = schnipp.dynforms.primitive_field(
        {
            label: 'Testlabel',
            name: 'testname'
        }
    )
    obj.dom.input = $('<input type="text" name="test" value="">')
    var rendered = obj.render()
    obj.initialize()
    equal('', obj.get_data(), 'get_data returns empty str')
    obj.set_data("foo")
    equal('foo', obj.get_data(), 'get_data returns "foo"')
    obj.clear()
    equal('', obj.get_data(), 'get_data returns empty str')
})
