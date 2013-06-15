module('schnipp.dynforms.fields.form')

test('render view of form field', function() {
    var obj = schnipp.dynforms.fields.form(
        {
            label: 'Testlabel',
            name: 'testname',
            fields: [
                {
                    name: 'field1',
                    label: 'Fieldlabel',
                    type: 'text',
                    default_value: 'x'
                }
            ]
        },
        'y',
        {
            fieldtypes: schnipp.dynforms.fields
        }
    )
    var rendered = obj.render()
    obj.initialize()
    equal(rendered.find('input').attr('name'), 'field1', 'input name is field1')
    ok(rendered.text().substr('Fieldlabel'), 'view contains label')
})

test('get set clear', function() {
    var obj = schnipp.dynforms.fields.form(
        {
            label: 'Testlabel',
            name: 'testname',
            fields: [
                {
                    name: 'field1',
                    label: 'Fieldlabel',
                    type: 'text',
                    default_value: 'x'
                }
            ]
        },
        {field1: 'y'},
        {
            fieldtypes: schnipp.dynforms.fields
        }
    )
    var rendered = obj.render()
    obj.initialize()
    equal(obj.get_data().field1, 'y', 'field value is y')

    obj.set_data({field1:'z'})
    equal(obj.get_data().field1, 'z', 'field value is z')

    obj.clear()
    equal(obj.get_data().field1, 'x', 'field value is x')
})
