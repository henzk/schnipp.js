module('schnipp.models.observable')

var MOCK_DATA = {
    first_name:'Toni',
    last_name: 'Michel',
    job: {
        company: 'schnapptack',
        role: 'developer'
    }
}

// observable tests
test('observable instantiation', function() {
    var obj = schnipp.models.observable(MOCK_DATA)
    deepEqual(obj.raw_data, MOCK_DATA)
    equal(obj.get('first_name'), 'Toni')
    equal(obj.get('last_name'), 'Michel')
    deepEqual(obj.get('job'), MOCK_DATA.job)
})

asyncTest('test change events on set', 2, function() {
    var obj = schnipp.models.observable(MOCK_DATA)
    obj.events.bind('change:first_name', function() {
        equal(obj.get('first_name'), 'Henne')
    })
    obj.events.bind('change', function() {
        equal(obj.get('first_name'), 'Henne')
    })
    obj.set('first_name', 'Henne')
    start()
})

asyncTest('test change events on update', 2, function() {
    var obj = schnipp.models.observable(MOCK_DATA)
    obj.events.bind('change:first_name', function() {
        equal(obj.get('first_name'), 'Henne')
    })
    obj.events.bind('change', function() {
        equal(obj.get('last_name'), 'Speidel')
    })
    obj.update({
        first_name: 'Henne',
        last_name: 'Speidel'
    })
    start()
})


// ---------------------------------------------------------------------------------------------
// observable list tests


function get_olist(nbr_of_elems) {
    var list = schnipp.models.object_list()
    for (var i=0; i<nbr_of_elems; i++) {
        list.append(schnipp.models.observable({
            first_name: 'Toni',
            last_name: 'Michel',
            for_index: i
        }))
    }
    return list

}

test('object list instantiation', function() {
    var olist = get_olist(0)
    equal(olist.size(), 0)

})

test('test retrieve functions', function() {
    var olist = get_olist(10)
    equal(olist.size(), 10)
    var elem_9 = olist.get(9)
    equal(elem_9.get('for_index'), 9)
    elem_9.id = 42
    equal(olist.get_by_id(elem_9.id).id, elem_9.id)
})

test('test update functions', function() {
    var olist = get_olist(0)

    // test append
    olist.append(schnipp.models.observable({a:0}))
    olist.append(schnipp.models.observable({a:1}))
    olist.append(schnipp.models.observable({a:2}))

    equal(olist.size(), 3)
    equal(olist.get(0).get('a'), 0)
    equal(olist.get(1).get('a'), 1)
    equal(olist.get(2).get('a'), 2)

    // test insert
    olist.insert(0, schnipp.models.observable({a:4}))
    equal(olist.get(0).get('a'), 4)
    equal(olist.get(2).get('a'), 1)
    equal(olist.size(), 4)

    // test remove
    olist.remove(0)
    equal(olist.get(0).get('a'), 0)
    equal(olist.size(), 3)

    // test remove_by_id
    var obj_5 = schnipp.models.observable({a:5})
    olist.append(obj_5)
    equal(olist.size(), 4)
    olist.remove_by_id(obj_5.id)
    equal(olist.size(), 3)

    // test index_of
    equal(olist.index_of(obj_5), undefined)
    equal(olist.index_of(olist.get(0)), 0)

    // test clear
    olist.clear()
    equal(olist.size(), 0)

})

asyncTest('test list insert events', 20, function() {
    var olist = schnipp.models.object_list()

    olist.events.bind('insert', function(args, evt) {
        equal(olist.size(), args.src.size())
    })
    olist.events.bind('pre-insert', function(args, evt) {
        equal(olist.size(), args.src.size())
    })


    for (var i=0; i<5; i++) {
        olist.append(schnipp.models.observable({a:i}))
    }

    for (var i=0; i<5; i++) {
        olist.insert(i, schnipp.models.observable({a:i}))
    }

    start()
})

asyncTest('test list remove events', 1, function() {
    var olist = schnipp.models.object_list()
    for (var i=0; i<5; i++) {
        olist.append(schnipp.models.observable({a:i}))
    }
    var obj = olist.get(0)

    // list-wide remove event
    olist.events.bind('remove', function(args, evt) {
        equal(args.element.id, obj.id)
    })

    olist.remove(0)
    start()
})
