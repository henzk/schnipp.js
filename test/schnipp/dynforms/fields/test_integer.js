module('schnipp.dynforms.fields.integer')

test('render view of integer field', function() {
    var obj = schnipp.dynforms.fields.integer(
        {
            label: 'Testlabel',
            name: 'testname'
        },
        678
    )
    var rendered = obj.render()
    obj.initialize()
    equal(obj.dom.input.val(), '678', 'input value is 678')
    equal(rendered.find('input').attr('name'), 'testname', 'input name is testname')
    ok(rendered.text().substr('Testlabel'), 'view contains label')
})

test('get set clear', function() {
    var obj = schnipp.dynforms.fields.integer(
        {
            label: 'Testlabel',
            name: 'testname'
        },
        678
    )
    var rendered = obj.render()
    obj.initialize()
    equal(obj.dom.input.val(), '678', 'input value is 678')
    equal(obj.get_data(), 678, 'field value is 678')

    obj.set_data(123)
    equal(obj.dom.input.val(), '123', 'input value is 123')
    equal(obj.get_data(), 123, 'field value is 123')

    obj.clear()
    equal('', obj.dom.input.val(), 'input value is empty str')
    ok(isNaN(obj.get_data()), 'field value is NaN')
})

test('validate', function() {
    var obj = schnipp.dynforms.fields.integer(
        {
            label: 'Testlabel',
            name: 'testname',
            required: true,
            min_value: 1,
            max_value: 10
        }
    )
    var rendered = obj.render()
    obj.initialize()
    obj.set_data('')
    ok(isNaN(obj.get_data()), 'value is NaN')
    var result = obj.validate()
    ok(!result.valid, 'validation result is invalid')
    ok(result.errors.nan, 'validation error is nan')
    obj.set_data(0)
    var result = obj.validate()
    ok(!result.valid, 'validation result is invalid')
    ok(result.errors.value_too_low, 'validation error is value_too_low')
    obj.set_data(11)
    var result = obj.validate()
    ok(!result.valid, 'validation result is invalid')
    ok(result.errors.value_too_high, 'validation error is value_too_high')
})

