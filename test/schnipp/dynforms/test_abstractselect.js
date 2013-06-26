module('schnipp.dynforms.abstractselect')

test('initial: field with initial data', function() {
    var obj = schnipp.dynforms.abstractselect(
        {
            label: 'Testlabel',
            name: 'testname',
            options: [
                {value:1, label:1}
            ]
        },
        1
    )
    equal(obj.get_initial_data(), 1)
})

test('test set_data', function() {
    var obj = schnipp.dynforms.abstractselect(
        {
            label: 'Testlabel',
            name: 'testname',
            options: [
                {value:1, label:1}
            ]
        }
    )
    obj.set_data(1)
    equal(obj.get_data(), 1)
})

test('test get_option_by_value', function() {
    var obj = schnipp.dynforms.abstractselect(
        {
            label: 'Testlabel',
            name: 'testname',
            options: [
                {value:1, label:1}
            ]
        }
    )
    deepEqual(obj.get_option_by_value(1), {index:0, value:1, label:1})
})


