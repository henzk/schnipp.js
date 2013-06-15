module('schnipp.dynforms.fields.base')

test('render container of base field', function() {
    var schema = {
        label: 'Testlabel',
        name: 'testname'
    }
    var obj = schnipp.dynforms.fields.base(
        schema,
        ''
    )
    equal(obj.dom.main, null, 'dom main is null')
    var input = $('<input type="text" name="test" value="">')
    var rendered = obj.render_container(schema, input)
    equal('test', rendered.find('input').attr('name'), 'rendered container contains input elem')
    ok(rendered.text().substr('Testlabel'), 'container contains label')
})

test('render container of base field without label', function() {
    var schema = {
        name: 'testname'
    }
    var obj = schnipp.dynforms.fields.base(
        schema,
        ''
    )
    equal(obj.dom.main, null, 'dom main is null')
    var input = $('<input type="text" name="test" value="">')
    var rendered = obj.render_container(schema, input)
    equal('test', rendered.find('input').attr('name'), 'rendered container contains input elem')
    ok(!rendered.find('label').length, 'container contains no label')
})

test('render view of base field', function() {
    var obj = schnipp.dynforms.fields.base(
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

test('initial: field with initial data', function() {
    var obj = schnipp.dynforms.fields.base(
        {
            label: 'Testlabel',
            name: 'testname'
        },
        'initial'
    )
    obj.dom.input = $('<input type="text" name="test" value="">')
    var rendered = obj.render()
    obj.initialize()
    equal('initial', obj.get_initial_data(), 'explicit initial data is returned')
})

test('initial/default: field with no initial data, but default', function() {
    var obj = schnipp.dynforms.fields.base(
        {
            label: 'Testlabel',
            name: 'testname',
            default_value: 'default'
        }
    )
    obj.dom.input = $('<input type="text" name="test" value="">')
    var rendered = obj.render()
    obj.initialize()
    equal('default', obj.get_initial_data(), 'get_initial: default_value is returned from schema')
    equal('default', obj.get_default_data(), 'get_default: default_value is returned from schema')
})

test('initial/default: field with no initial data, no default', function() {
    var obj = schnipp.dynforms.fields.base(
        {
            label: 'Testlabel',
            name: 'testname',
        }
    )
    /*patch in sentinel*/
    obj.default_value = 'patched_default'
    obj.dom.input = $('<input type="text" name="test" value="">')
    var rendered = obj.render()
    obj.initialize()
    equal('patched_default', obj.get_initial_data(), 'get_initial: default_value is returned from field')
    equal('patched_default', obj.get_default_data(), 'get_default: default_value is returned from field')
})

test('get, set, clear', function() {
    var obj = schnipp.dynforms.fields.base(
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