module('schnipp.dynforms.fields.select')

function throwsSchemaError(testfunc, description) {
    var err = false
    try {
        testfunc()
    } catch(e) {
        if (e.name == 'SchemaError') {
            ok(true, description)
            err = true
        } else {
            throw e
        }
    }
    if (!err) {
        ok(false, description)
    }
}

test('select without options', function() {
    throwsSchemaError(function() {
        var obj = schnipp.dynforms.fields.select(
            {
                label: 'Testlabel',
                name: 'testname'
            }
        )
    }, 'throws SchemaError without options')
})

test('select with empty options', function() {
    throwsSchemaError(function() {
        var obj = schnipp.dynforms.fields.select(
            {
                label: 'Testlabel',
                name: 'testname',
                options: []
            }
        )
    }, 'throws SchemaError on empty options')
})

test('select with faulty options', function() {
    throwsSchemaError(function() {
        var obj = schnipp.dynforms.fields.select(
            {
                label: 'Testlabel',
                name: 'testname',
                options: [
                    'str'
                ]
            }
        )
    }, 'throws SchemaError on non-array option')
    throwsSchemaError(function() {
        var obj = schnipp.dynforms.fields.select(
            {
                label: 'Testlabel',
                name: 'testname',
                options: [
                    [1]
                ]
            }
        )
    }, 'throws SchemaError on too short array option')
})

test('select with duplicate options', function() {
    throwsSchemaError(function() {
        var obj = schnipp.dynforms.fields.select(
            {
                label: 'Testlabel',
                name: 'testname',
                options: [
                    ['dup', 'dup1'],
                    ['dup', 'dup2']
                ]
            }
        )
    }, 'throws SchemaError on duplicate key in options')
})

test('select with multiple option defaults', function() {
    throwsSchemaError(function() {
        var obj = schnipp.dynforms.fields.select(
            {
                label: 'Testlabel',
                name: 'testname',
                default_value: 'one',
                options: [
                    ['one', 'One', true],
                    ['two', 'Two', true]
                ]
            }
        )
    }, 'throws SchemaError with default_value and option default')
})

test('select with default_value and option default', function() {
    throwsSchemaError(function() {
        var obj = schnipp.dynforms.fields.select(
            {
                label: 'Testlabel',
                name: 'testname',
                default_value: 'one',
                options: [
                    ['one', 'One'],
                    ['two', 'Two', true]
                ]
            }
        )
    }, 'throws SchemaError with default_value and option default')
})

test('inital defaults to empty value', function() {
    var obj = schnipp.dynforms.fields.select(
        {
            label: 'Testlabel',
            name: 'testname',
            options: [
                ['1', 'one']
            ]
        }
    )
    obj.empty_selection_value = 'empty_sentinel'
    var rendered = obj.render()
    obj.initialize()
    equal(obj.dom.input.val(), 'empty_sentinel', 'view: initial defaults to empty value')
    equal(obj.get_data(), 'empty_sentinel', 'api: initial defaults to empty value')
})

test('inital uses empty_selection_value from schema', function() {
    var obj = schnipp.dynforms.fields.select(
        {
            label: 'Testlabel',
            name: 'testname',
            empty_selection_value: 'empty_sentinel',
            empty_selection_label: 'custom empty label',
            options: [
                ['1', 'one']
            ]
        }
    )
    var rendered = obj.render()
    obj.initialize()
    equal(obj.dom.input.val(), 'empty_sentinel', 'view: initial defaults to empty value')
    equal(obj.get_data(), 'empty_sentinel', 'api: initial defaults to empty value')
})

test('inital uses default from schema', function() {
    var obj = schnipp.dynforms.fields.select(
        {
            label: 'Testlabel',
            name: 'testname',
            default_value: 'schema_default',
            empty_selection_value: 'empty_sentinel',
            options: [
                ['schema_default', 'one']
            ]
        }
    )
    var rendered = obj.render()
    obj.initialize()
    equal(obj.dom.input.val(), 'schema_default', 'view: initial uses schema default')
    equal(obj.get_data(), 'schema_default', 'api: initial uses schema default')
})

test('inital uses option default from schema', function() {
    var obj = schnipp.dynforms.fields.select(
        {
            label: 'Testlabel',
            name: 'testname',
            empty_selection_value: 'empty_sentinel',
            options: [
                ['schema_default', 'one', true]
            ]
        }
    )
    var rendered = obj.render()
    obj.initialize()
    equal(obj.dom.input.val(), 'schema_default', 'view: initial uses option default from schema')
    equal(obj.get_data(), 'schema_default', 'api: initial uses option default from schema')
})