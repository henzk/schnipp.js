module('schnipp.models.entity')

var define_mockjax = function(url, result) {
    $.mockjax({
        logging: false,
        url: url,
        responseTime: 750,
        responseText: {
            status: 'success',
            result: result
        }
    })
}

var MOCK_DATA = {
        first_name:'Toni',
        last_name: 'Michel',
        job: {
            company: 'schnapptack',
            role: 'developer'
        }
    }

/*
var FooEntity = schnipp.models.entity_type('FooEntity', function(self) {

    self.get_url = function() {
        return '/fetch/aaa/'
    }

})*/

// ------------------------------------------------------------
/*
test('smoke test', function() {
    var data = {first_name: 'Toni'}
    var e = schnipp.models.entity(null, null, data)
    equal(e.get('first_name'), 'Toni')
    deepEqual(e.get_data(), data)
})
*/
/*
asyncTest('test post-fetch event', 1, function() {
    define_mockjax('/fetch/aaa/', MOCK_DATA)
    var foo = FooEntity()
    foo.events.bind('post-fetch', function() {
        start()
        equal(foo.get('first_name'), 'Toni')
    })
    foo.fetch()
})

asyncTest('test fetch with callback', 1, function() {
    define_mockjax('/fetch/aaa/', MOCK_DATA)
    var foo = FooEntity()
    foo.fetch(function() {
        start()
        equal(foo.get('first_name'), 'Toni')
    })
})*/
