/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when      = require('when'),
    _         = require('underscore'),
    Instagram = require('instagram-node-lib'),
    appPath   = __dirname + '/../',
    logger;

function Insta(opt, mockServices) {
    var opts = opt || {};
    mockServices = mockServices || {};
    if (_.isObject(mockServices.logger)) {
        logger = mockServices.logger;
    } else if (_.isObject(opts.logger)) {
        logger = opts.logger;
    } else {
        logger = {
            log: function log(level, msg) {
                console.log(level, msg);
            }
        };
    }
    if (_.isObject(mockServices.Instagram)) {
        Instagram = mockServices.Instagram;
    }
    Instagram.set('client_id', opts.instagram.clientId);
    Instagram.set('client_secret', opts.instagram.clientSecret);
}

Insta.prototype.getTagInfo = function getTagInfo(tagName) {
    return when.promise(function (resolve, reject) {
        Instagram.tags.info({
            name: tagName,
            complete: function complete(data) {
                resolve(data);
            }
        });
    });
};

Insta.prototype.getRecentMediasForTag = function getRecentMediasForTag(tag, numberOfMedia) {
    return when.promise(function (resolve, reject) {
        logger.log('info', 'Get recent media for this tag.');
        Instagram.tags.recent({
            name: tag,
            count: numberOfMedia || 5000,
            //min_tag_id: '703011214095846623_15759898',
            complete: function complete(data) {
                //console.log(JSON.stringify(data, null, 4));
                resolve(data);
            }
        });
    });
};

Insta.prototype.getLikesForMedia = function getLikesForMedia(mediaId) {
    return when.promise(function (resolve, reject) {
        //jscs:disable
        Instagram.media.likes({
            media_id: mediaId,
            complete: function complete(data) {
                resolve(data);
            }
        });
        //jscs:enable
    });
};

Insta.prototype.getRecentMediasForTagFull = function getRecentMediasForTagFull(tagName, userName, maxHits) {
    return when.promise(function (resolve, reject) {
        var filteredMediaList = [];
        when(Insta.prototype.getTagInfo(tagName))
            .then(function (tagInfo) {
                return Insta.prototype.getRecentMediasForTag(tagInfo.name, maxHits);
            })
            .then(function (mediaList) {
                for (var i = 0; i < mediaList.length; i++) {
                    if (mediaList[i].user.username.match(new RegExp(userName))) {
                        filteredMediaList.push(mediaList[i]);
                    }
                }
                return when.promise(function (resolve, reject) {
                    when.all(_.map(filteredMediaList, function (media, i) {
                        return Insta.prototype.getLikesForMedia(media.id);
                    }))
                        .done(function (likeLists) {
                            for (var i = 0; i < likeLists.length; i++) {
                                filteredMediaList[i].likes.data = likeLists[i];
                            }
                            resolve(filteredMediaList);
                        }, function (error) {
                            reject(error);
                        });
                });
            })
            .done(function (filteredMediaList) {
                resolve(filteredMediaList);
            }, reject);
    });
};

module.exports = Insta;
