/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['app/**/*.js', 'lib/**/*.js']
            },
            test: {
                src: ['test/**/*.js']
            }
        },

        jscs: {
            main: ['app/**/*.js', 'lib/**/*.js', 'test/**/*.js'],
            options: {
                config: ".jscsrc"
            }
        },

        watch: {
            all: {
                files: ['app/**/*.js', 'lib/**/*.js', 'test/**/*.js', 'config/*.js'],
                tasks: ['lint', 'buster:unit']
            }
        },

        buster: {
            unit: {
            }
        },
        nodemon: {
            dev: {
                options: {
                    file: 'app/app.js',
                    args: ['-c', 'config/config-dist.js']
                },
                tasks: ['lint', 'buster:unit']
            }
        },
        shell: {
            multiple: {
                command: [
                    'rm -rf artifact',
                    'mkdir -p artifact',
                    'mv node_modules ../node_modules2',
                    'npm install --production',
                    'tar -zcf artifact/node-boilerplate.tar.gz .',
                    'rm -rf node_modules',
                    'mv ../node_modules2 node_modules'
                ].join('&&')
            }
        },
        coveralls: {
            real_coverage: {
                src: 'coverage/lcov.info'
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-buster');
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks('grunt-coveralls');

    // Default task.
    grunt.registerTask( "lint", [ "jshint", "jscs" ] );
    grunt.registerTask('default', ['lint', 'buster:unit']);
    grunt.registerTask('test', 'buster:unit');
    grunt.registerTask('check', ['watch']);
    grunt.registerTask('run', ['buster:unit', 'nodemon:dev']);
    grunt.registerTask('artifact', ['shell', 'coveralls:real_coverage']);

};
