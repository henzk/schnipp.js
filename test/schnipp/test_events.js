module('schnipp.events')

test('smoketest', function() {
    var es = schnipp.events.event_support()
    ok(true, 'event_support can be instanciated')
})

asyncTest('bind and fire, no arg', 2, function() {
    var es = schnipp.events.event_support()

    es.bind('testevent', function(args, evt) {
        equal('testevent', evt, 'event has value testevent')
        ok(true, 'event received')
        start()
    })

    es.fire('testevent')
})

asyncTest('bind and fire, with arg', 3, function() {
    var es = schnipp.events.event_support()

    es.bind('testevent', function(args, evt) {
        equal('testevent', evt, 'event has value testevent')
        equal('testval', args.testarg, 'testarg has value "testval"')
        ok(true, 'event received')
        start()
    })

    es.fire('testevent', {testarg: 'testval'})
})


asyncTest('multibind and fire', 6, function() {
    var es = schnipp.events.event_support()

    es.bind('testevent', function(args, evt) {
        equal('testevent', evt, 'event has value testevent')
        equal('testval', args.testarg, 'testarg has value "testval"')
        ok(true, 'event received')
    })

    es.bind('testevent', function(args, evt) {
        equal('testevent', evt, 'event has value testevent')
        equal('testval', args.testarg, 'testarg has value "testval"')
        ok(true, 'event received')
        start()
    })

    es.fire('testevent', {testarg: 'testval'})
})

asyncTest('bind and multiple fires', 6, function() {
    var es = schnipp.events.event_support()

    es.bind('testevent', function(args, evt) {
        equal('testevent', evt, 'event has value testevent')
        equal('testval', args.testarg, 'testarg has value "testval"')
        ok(true, 'event received')
    })

    es
        .fire('testevent', {testarg: 'testval'})
        .fire('testevent', {testarg: 'testval'})

    start()
})

asyncTest('bind, fire, unbind, fire', 3, function() {
    var es = schnipp.events.event_support()

    handler = function(args, evt) {
        equal('testevent', evt, 'event has value testevent')
        equal('testval', args.testarg, 'testarg has value "testval"')
        ok(true, 'event received')
    }

    es
        .bind('testevent', handler)
        .fire('testevent', {testarg: 'testval'})
        .unbind('testevent', handler)
        .fire('testevent', {testarg: 'testval'})

    start()
})

asyncTest('bind multiple, fire, unbind one, fire', 9, function() {
    var es = schnipp.events.event_support()

    handler = function(args, evt) {
        equal('testevent', evt, 'event has value testevent')
        equal('testval', args.testarg, 'testarg has value "testval"')
        ok(true, 'event received')
    }
    handler2 = function(args, evt) {
        equal('testevent', evt, 'event has value testevent')
        equal('testval', args.testarg, 'testarg has value "testval"')
        ok(true, 'event received')
    }

    es
        .bind('testevent', handler)
        .bind('testevent', handler2)
        .fire('testevent', {testarg: 'testval'})
        .unbind('testevent', handler)
        .fire('testevent', {testarg: 'testval'})

    start()
})

asyncTest('bind, fire, unbind other, fire', 6, function() {
    var es = schnipp.events.event_support()

    handler = function(args, evt) {
        equal('testevent', evt, 'event has value testevent')
        equal('testval', args.testarg, 'testarg has value "testval"')
        ok(true, 'event received')
    }

    es
        .bind('testevent', handler)
        .fire('testevent', {testarg: 'testval'})
        .unbind('testevent2', handler)
        .fire('testevent', {testarg: 'testval'})

    start()
})

asyncTest('bind, fire_and_unbind, fire', 6, function() {
    var es = schnipp.events.event_support()

    handler = function(args, evt) {
        equal('testevent', evt, 'event has value testevent')
        equal('testval', args.testarg, 'testarg has value "testval"')
        ok(true, 'event received')
    }

    es
        .bind('testevent', handler)
        .fire_and_unbind('testevent2', {testarg: 'testval'})
        .fire('testevent', {testarg: 'testval'})
        .fire_and_unbind('testevent', {testarg: 'testval'})
        .fire('testevent', {testarg: 'testval'})

    start()
})