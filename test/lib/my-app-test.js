/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var buster = require('buster'),
    assert = buster.assert,
    refute = buster.refute,
    when   = require('when'),
    appPath = __dirname + '/../../';

buster.testCase('lib/logger', {
    setUp: function () {
    },
    tearDown: function () {
        delete require.cache[require.resolve(appPath + 'lib/my-app')];
    },
    'Test module:': {
        'dummy sync test': function () {
            assert(true);
        },

        'dummy async test': function (done) {
            // Do some async stuff and call done.
            assert(true);
            done();
        },

        'dummy async w/promises test': function (done) {
            when(function functionWhichReturnsAPromise() {
                return 'my promise';
            })
                .done(function success(result) {
                    assert(true);
                    done();
                }, function error(result) {
                    assert(true);
                    done();
                });
        },

        'exposed run function w/mock services': function () {
            var logger = {
                log: this.spy()
            };
            var MyApp = require(appPath + 'lib/my-app');
            var myApp = new MyApp({}, {logger: logger});
            myApp.run();
            assert.called(logger.log);
        },

        'exposed run function w/options': function () {
            var logger = {
                log: this.spy()
            };
            var MyApp = require(appPath + 'lib/my-app');
            var myApp = new MyApp({logger: logger});
            myApp.run();
            assert.called(logger.log);
        }
    }
});
