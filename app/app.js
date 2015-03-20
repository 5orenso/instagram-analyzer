/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var path = require('path'),
    commander = require('commander'),
    when   = require('when'),
    _       = require('underscore'),
    appPath = path.normalize(__dirname + '/../');

commander
    .option('-c, --config <file>', 'configuration file path', './config/config.js')
    .option('-s, --server <server ip>', 'ip of server', '127.0.0.1')
    .option('-t, --tag <tag>', 'name of the hash tag', 'sorenso')
    .option('-s, --user <tag>', 'name of the user', 'sorenso')
    .parse(process.argv);

var config = require(appPath + commander.config);

var Logger = require(appPath + 'lib/logger'),
    logger = new Logger({
        logLevel: config.logLevel
    });

var Insta = require(appPath + 'lib/instagram.js'),
    insta = new Insta({
        instagram: config.instagram,
        logger: logger
    });

when(insta.getRecentMediasForTagFull(commander.tag, commander.user, 10))
    .done(function (mediaList) {
        //console.log('mediaList', JSON.stringify(mediaList, null, 4));
        for (var i = 0; i < mediaList.length; i++) {
            console.log('#' + i + ': ', mediaList[i].caption.text);
            console.log('    ', 'Likes (count/elements):', mediaList[i].likes.count, mediaList[i].likes.data.length);
            console.log('    ', 'Comments (count/elements):',
                mediaList[i].comments.count, mediaList[i].comments.data.length);
        }
    }, console.error);
