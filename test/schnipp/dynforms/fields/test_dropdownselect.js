test('test rendered output', function() {
    var obj = schnipp.dynforms.fields.dropdownselect(
        {
            label: 'Testlabel',
            name: 'testname',
            options: [
                {value:1, label:1},{value:2, label:2},{value:3, label:3}
            ]
        },
        1
    )
    
    rendered = obj.render()
    obj.initialize()
    
    equal(rendered.find('.schnippforms-dropdownselect-options').length, 1)
    equal(rendered.find('.schnippforms-dropdownselect-input').length, 1)
    equal(rendered.find('.schnippforms-dropdownselect-display').length, 1)
    
})


asyncTest('test item select', 3, function() {
    var obj = schnipp.dynforms.fields.dropdownselect(
        {
            label: 'Testlabel',
            name: 'testname',
            options: [
                {value:1, label:1},{value:2, label:2},{value:3, label:3}
            ]
        },
        1
    )
    var rendered = obj.render()
    obj.initialize()
    obj.events.bind('change', function(args) {
        equal(obj.selected_option.value, 2)
        equal(args.value, 2)
        equal(obj.selected, 2)
    })
    
    var items = rendered.find('.schnippforms-dropdownselect-options div')
    $(items[1]).click()
    start()
    
})
