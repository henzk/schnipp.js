module('schnipp.dynforms.abstract_field')

test('initial: field with initial data', function() {
    var obj = schnipp.dynforms.abstract_field(
        {
            label: 'Testlabel',
            name: 'testname'
        },
        'initial'
    )
    equal('initial', obj.get_initial_data(), 'explicit initial data is returned')
})

test('initial/default: field with no initial data, but default', function() {
    var obj = schnipp.dynforms.abstract_field(
        {
            label: 'Testlabel',
            name: 'testname',
            default_value: 'default'
        }
    )
    equal('default', obj.get_initial_data(), 'get_initial: default_value is returned from schema')
    equal('default', obj.get_default_data(), 'get_default: default_value is returned from schema')
})

test('initial/default: field with no initial data, no default', function() {
    var obj = schnipp.dynforms.abstract_field(
        {
            label: 'Testlabel',
            name: 'testname',
        }
    )
    /*patch in sentinel*/
    obj.default_value = 'patched_default'
    equal('patched_default', obj.get_initial_data(), 'get_initial: default_value is returned from field')
    equal('patched_default', obj.get_default_data(), 'get_default: default_value is returned from field')
})
