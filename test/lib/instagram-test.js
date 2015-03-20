/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var buster  = require('buster'),
    assert  = buster.assert,
    refute  = buster.refute,
    when    = require('when'),
    _       = require('underscore'),
    appPath = __dirname + '/../../';

var config = {
    instagram: {
        clientId: '',
        clientSecret: ''
    }
};

var mocks = {
    Instagram: {
        set: function () {},
        tags: {
            recent: function (opts) {
                if (_.isFunction(opts.complete)) {
                    //jscs:disable
                    opts.complete([{ attribution: null,
                        tags: [ 'sorenso', 'alaskahusky', 'race', 'happiness', 'skiing' ],
                        location: { latitude: 60.015922217, longitude: 10.604446667 },
                        comments: { count: 4, data: [Object] },
                        filter: 'Hudson',
                        created_time: '1423764535',
                        link: 'https://instagram.com/p/zArk-AzI-x/',
                        likes: { count: 51, data: [Object] },
                        images: {
                            low_resolution: [Object],
                            thumbnail: [Object],
                            standard_resolution: [Object]
                        },
                        users_in_photo: [],
                        caption: {
                            created_time: '1423764535',
                            text: 'The happiest girls at the stadium. #sorenso #Happiness #skiing #alaskahusky #race',
                            from: [Object],
                            id: '918925980696612125'
                        },
                        type: 'image',
                        id: opts.name,
                        user:
                        {
                            username: 'sorenso',
                            profile_picture: 'https://instagramimages-a.akamaihd.net/profiles/profile_15759898_75sq_1380487864.jpg',
                            id: '15759898',
                            full_name: 'Øistein Sørensen'
                        }
                    }]);
                    //jscs:enable
                }
            },
            info: function (opts) {
                if (_.isFunction(opts.complete)) {
                    //jscs:disable
                    opts.complete({media_count: 22, name: opts.name});
                    //jscs:enable
                }
            }
        },
        media: {
            likes: function (opts) {
                //jscs:disable
                if (opts.media_id.match('throw error')) {
                    throw new Error('Booom!');
                } else if (_.isFunction(opts.complete)) {
                    opts.complete([{
                        username: 'christian_chammas',
                        profile_picture: 'https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/11022922_372368216284769_1418619783_a.jpg',
                        id: '1603126796',
                        full_name: 'Christian | Stuttgart'
                    }]);
                }
                //jscs:enable
            }
        }
    }
};

buster.testCase('lib/logger', {
    setUp: function () {
        this.timeout = 5000;
    },
    tearDown: function () {
        delete require.cache[require.resolve(appPath + 'lib/instagram')];
    },
    'Test module instagram:': {

        'init with options': function () {
            var Insta = require(appPath + 'lib/instagram');
            var insta = new Insta({
                logger: {
                    log: function (level, msg) { console.log(level, msg); }
                },
                instagram: {}
            });
            assert.isFunction(insta.getRecentMediasForTag);
            assert.isFunction(insta.getTagInfo);
        },

        'init with mock': function () {
            var Insta = require(appPath + 'lib/instagram');
            var insta = new Insta(config, {
                logger: {
                    log: function (level, msg) { console.log(level, msg); }
                }
            });
            assert.isFunction(insta.getRecentMediasForTag);
            assert.isFunction(insta.getTagInfo);
        },

        'method getRecentMediaForTag': function (done) {
            var Insta = require(appPath + 'lib/instagram');
            var insta = new Insta(config, mocks);
            when(insta.getRecentMediasForTag('sorenso'))
                .done(function (result) {
                    assert.isArray(result);
                    assert.isObject(result[0].images);
                    assert.isObject(result[0].user);
                    //[{ attribution: null,
                    //    tags: [ 'sorenso', 'alaskahusky', 'race', 'happiness', 'skiing' ],
                    //    location: { latitude: 60.015922217, longitude: 10.604446667 },
                    //    comments: { count: 4, data: [Object] },
                    //    filter: 'Hudson',
                    //        created_time: '1423764535',
                    //    link: 'https://instagram.com/p/zArk-AzI-x/',
                    //    likes: { count: 51, data: [Object] },
                    //    images:
                    //    { low_resolution: [Object],
                    //        thumbnail: [Object],
                    //        standard_resolution: [Object] },
                    //    users_in_photo: [],
                    //        caption:
                    //    { created_time: '1423764535',
                    //        text: 'The happiest girls at the stadium. #sorenso #Happiness #skiing #alaskahusky #race',
                    //        from: [Object],
                    //        id: '918925980696612125' },
                    //    type: 'image',
                    //        id: '918925980470120369_15759898',
                    //    user:
                    //    { username: 'sorenso',
                    //        profile_picture: 'https://instagramimages-a.akamaihd.net/profiles/profile_15759898_75sq_1380487864.jpg',
                    //        id: '15759898',
                    //        full_name: 'Øistein Sørensen' } }]
                    done();
                }, function (error) {
                    console.error('getRecentMediasForTag->error', error);
                });
        },

        'method getRecentMediaForTagFull': function (done) {
            var Insta = require(appPath + 'lib/instagram');
            var insta = new Insta(config, mocks);
            when(insta.getRecentMediasForTagFull('sorenso'))
                .done(function (result) {
                    assert.isArray(result);
                    assert.isObject(result[0].images);
                    assert.isObject(result[0].user);
                    done();
                }, function (error) {
                    console.error('getRecentMediasForTagFull->error', error);
                });
        },

        'method getRecentMediaForTagFull w/error': function (done) {
            var Insta = require(appPath + 'lib/instagram');
            var insta = new Insta(config, mocks);
            when(insta.getRecentMediasForTagFull('throw error'))
                .done(function (result) {
                    console.error('getRecentMediasForTagFull->log', result);
                }, function (error) {
                    assert.isObject(error);
                    assert.equals(new Error('Booom!'), error);
                    done();
                });
        },

        'method getTagInfo': function (done) {
            var Insta = require(appPath + 'lib/instagram');
            var insta = new Insta(config, mocks);
            when(insta.getTagInfo('sorenso'))
                .done(function (result) {
                    assert.isObject(result);
                    assert.isString(result.name);
                    //assert.isNumber(result.media_name);
                    // { media_count: 22, name: 'sorenso' }
                    done();
                }, function (error) {
                    console.error('getTagInfo->error', error);
                });
        },

        'method getLikesForMedia': function (done) {
            var Insta = require(appPath + 'lib/instagram');
            var insta = new Insta(config, mocks);
            when(insta.getLikesForMedia('abc123'))
                .done(function (result) {

                    //->  [ { username: 'krisrak',
                    //    profile_picture: 'http://profile/path.jpg',
                    //    id: '#',
                    //    full_name: 'Rak Kris' },
                    //    { username: 'mikeyk',
                    //        profile_picture: 'http://profile/path.jpg',
                    //        id: '#',
                    //        full_name: 'Mike Krieger' } ]

                    assert.isArray(result);
                    done();
                }, function (error) {
                    console.error('getTagInfo->error', error);
                });
        }

    }
});
