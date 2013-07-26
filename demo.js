$(function() {
    var schema = {
        name: 'form1',
        label: 'This is a form',
        fields: [
            {
                label: 'Test1',
                type: 'text',
                name: 'test1',
                default_value: 'aaa'
            },
            {
                label: 'Test2',
                type: 'textarea',
                name: 'test2',
                default_value: 'bbb'
            },
            {
                label: 'Test3',
                type: 'text',
                name: 'test3',
                default_value: 'bbbsss',
                required: true
            },
            {
                label: 'Color1',
                type: 'color',
                name: 'color1',
                default_value: '#AAAAAA',
                required: true
            },
            {
                label: 'Int1',
                type: 'integer',
                name: 'int1',
                default_value: 5,
                min_value: 10
            },
            {
                label: 'Float1',
                type: 'floatingpoint',
                name: 'float1',
                default_value: 25.1
            },
            {
                label: 'Check1',
                type: 'checkbox',
                name: 'check1',
                default_value: true
            },
            {
                label: 'Select1',
                type: 'select',
                name: 'select1',
                default_value: 'blue',
                options: [
                    ['blue', 'blue'],
                    ['green', 'green'],
                    ['red', 'red'],
                ],
            },
            {
                label: 'Form1',
                type: 'form',
                name: 'form1',
                default_value: {},
                fields: [
                    {
                        label: 'Float1',
                        type: 'floatingpoint',
                        name: 'float1',
                        default_value: 25.1
                    },
                    {
                        label: 'Check1',
                        type: 'checkbox',
                        name: 'check1',
                        default_value: true
                    },
                    {
                        label: 'Select1',
                        type: 'select',
                        name: 'select1',
                        default_value: 'blue',
                        options: [
                            ['blue', 'blue'],
                            ['green', 'green'],
                            ['red', 'red'],
                        ],
                    },
                    {
                        label: 'Form1',
                        type: 'form',
                        name: 'form1',
                        default_value: {},
                        fields: [
                            {
                                label: 'Float1',
                                type: 'floatingpoint',
                                name: 'float1',
                                default_value: 25.1
                            },
                            {
                                label: 'Check1',
                                type: 'checkbox',
                                name: 'check1',
                                default_value: true
                            },
                            {
                                label: 'Select1',
                                type: 'select',
                                name: 'select1',
                                default_value: 'blue',
                                options: [
                                    ['blue', 'blue'],
                                    ['green', 'green'],
                                    ['red', 'red'],
                                ],
                            }
                        ],
                    }
                ],
            }
        ],
        fields_display: [
            ['test2', 'test1'], 'test3', 'color1', 'int1', 'float1', 'check1', 'select1', 'form1'
        ],
        fieldsets: [
            {
                classes: [],
                label: 'Main Settings',
                fields_display: [['test2', 'test1'], ['test3', 'color1']]
            },
            {
                classes: [],
                label: 'Not so important',
                fields_display: ['int1', 'float1', 'check1', 'select1', 'form1']
            }
        ]
    };
    
    var form = schnipp.dynforms.form(schema, {});
    var submit = $('<input type="submit" value="submit"></submit>');
    submit.click(function() {
        console.log(form.get_data());
        console.log(form.do_validate());
        return false;
    });
    $('#content').append(form.render());
    
    form.initialize();
    
    var submitrow = $('<div></div>');
    submitrow.append(submit);
    submit.css('float', 'right');
    $('#content').append(submitrow);
    submit.button();

});
