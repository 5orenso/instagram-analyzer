/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when     = require('when'),
    _        = require('underscore'),
    appPath  = __dirname + '/../',
    logger;

function MyApp(opt, mockServices) {
    var opts = opt || {};
    mockServices = mockServices || {};
    if (_.isObject(mockServices.logger)) {
        logger = mockServices.logger;
    } else if (_.isObject(opts.logger)) {
        logger = opts.logger;
    }
}

MyApp.prototype.run = function run() {
    // Start my application and do all your stuff.
    logger.log('info', 'info: Done :)');
    logger.log('verbose', 'verbose: Done :)');
    logger.log('debug', 'debug: Done :)');
    this.say('Yo!');
};

MyApp.prototype.say = function say(text) {
    logger.log('info', text);
};

module.exports = MyApp;
