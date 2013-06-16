module('schnipp.dynforms.fields.floatingpoint')

test('smoketest', function() {
    var obj = schnipp.dynforms.form(
        {
            fields:[]
        }
    )
    var rendered = obj.render()
    obj.initialize()
    ok(true, 'form can be instanciated')
})

test('render', function() {
    var obj = schnipp.dynforms.form(
        {
            fields:[
                {
                    name: 'test',
                    type: 'text'
                },
                {
                    name: 'test2',
                    type: 'text'
                }
            ]
        }
    )
    var rendered = obj.render()
    obj.initialize()
    equal(rendered.find('input').eq(0).attr('name'), 'test', 'name of input should be test')
    equal(rendered.find('input').eq(1).attr('name'), 'test2', 'name of input should be test2')
})

test('render fields_display', function() {
    var obj = schnipp.dynforms.form(
        {
            fields:[
                {
                    name: 'test',
                    type: 'text'
                },
                {
                    name: 'test2',
                    type: 'text'
                }
            ],
            fields_display: ['test2', 'test']
        }
    )
    var rendered = obj.render()
    obj.initialize()
    equal(rendered.find('input').eq(1).attr('name'), 'test', 'name of input should be test')
    equal(rendered.find('input').eq(0).attr('name'), 'test2', 'name of input should be test2')
})

test('render fieldsets', function() {
    var obj = schnipp.dynforms.form(
        {
            fields:[
                {
                    name: 'test',
                    type: 'text'
                },
                {
                    name: 'test2',
                    type: 'text'
                }
            ],
            fieldsets: [
                {
                    classes: [],
                    fields_display: ['test2', 'test']
                }
            ]
        }
    )
    var rendered = obj.render()
    obj.initialize()
    equal(rendered.find('input').eq(1).attr('name'), 'test', 'name of input should be test')
    equal(rendered.find('input').eq(0).attr('name'), 'test2', 'name of input should be test2')

    var obj = schnipp.dynforms.form(
        {
            fields:[
                {
                    name: 'test',
                    type: 'text'
                },
                {
                    name: 'test2',
                    type: 'text'
                }
                ],
                fieldsets: [
                {
                    classes: ['collapse', 'testclass'],
                    label: 'a label',
                    fields_display: ['test2', 'test']
                }
            ]
        }
    )
    var rendered = obj.render()
    obj.initialize()
    equal(rendered.find('.schnippform-fieldset-label').text(), 'a label', 'fieldset should contain a label')
    ok(rendered.find('.schnippform-fieldset').hasClass('testclass'), 'fieldset should have class testclass')
    ok(rendered.find('.schnippform-fieldset').hasClass('collapse'), 'fieldset should have class collapse')
})

test('get_field_schema', function() {
    var schema = {
        fields:[
            {
                name: 'test',
                type: 'text'
            },
            {
                name: 'test2',
                type: 'text'
            }
        ]
    }
    var obj = schnipp.dynforms.form(
        schema
    )
    var rendered = obj.render()
    obj.initialize()
    equal(obj.get_field_schema('test2'), schema.fields[1], 'get_field_schema should return schema of test2')
})