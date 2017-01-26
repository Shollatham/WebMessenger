/* jshint node:true */
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  var defaultCompilerOpts = {
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    generate_exports: true,
    externs: [
      'web/src/lib/externs/jquery-1.7.js',
      'web/src/lib/externs/jquery-dateFormat.externs.js',
      'web/src/lib/externs/io.js'
    ],
    define: ['goog.DEBUG=false'],
    warning_level: 'verbose',
    jscomp_error: [
      'accessControls',
      'ambiguousFunctionDecl',
      'checkDebuggerStatement',
      'const',
      'constantProperty',
      'deprecated',
      'duplicate',
      'externsValidation',
      'fileoverviewTags',
      'globalThis',
      'internetExplorerChecks',
      'strictModuleDepCheck',
      'undefinedNames',
      'undefinedVars',
      'unknownDefines',
      'uselessCode'
    ],
    jscomp_warning: [
      'checkTypes',
      'invalidCasts',
      'missingProperties',
      'nonStandardJsDocs',
      'visibility'
    ],
    jscomp_off: [],
    summary_detail_level: 3,
    output_wrapper: '"(function(){%output%}).call(this);"'
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    targethtml: {
      dist: {
        options: {
          curlyTags: {
            rlsdate: '<%= grunt.template.today("yyyymmdd") %>'
          }
        },

        files: {
          'web/dist/index.html': 'web/src/index.html'
        }
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: './web/src/',
            src: [
              'css/**',

              // js
              'compiled/**',

              // lib
              'lib/jquery/**',
              'lib/jqueryui/**',
              'lib/socket.io/**',

              // root
              'index.html'
            ],
            dest: 'web/dist'
          }
        ]
      }
    },

    closureBuilder: {
      options: {
        builder: 'web/third-party/closure-library/closure/bin/build/closurebuilder.py',
        compilerFile: 'web/third-party/closure-compiler/compiler.jar',
        compile: true, // boolean
        namespaces: ['WebMessenger.App'],
        compilerOpts: defaultCompilerOpts,
        execOpts: {
          maxBuffer: 999999 * 1024
        }
      },

      advance: {
        src: [
          'web/src/js/',
          'web/third-party/closure-library/closure/goog',
          'web/third-party/closure-library/third_party'
        ],
        dest: 'web/src/compiled/WebMessenger.min.js'
      },

      simple: {
        options: {
          compilerOpts: grunt.util._.merge({}, defaultCompilerOpts, {
            compilation_level: 'SIMPLE_OPTIMIZATIONS',
            formatting: 'pretty_print',
            output_wrapper: "'(function(){%output%}).call(this);'"
          })
        },

        src: [
          'web/src/js/',
          'web/third-party/closure-library/closure/goog',
          'web/third-party/closure-library/third_party'
        ],

        dest: 'web/src/compiled/WebMessenger.sim.js'
      },

      whitespace: {
        options: {
          compilerOpts: grunt.util._.merge({}, defaultCompilerOpts, {
            compilation_level: 'WHITESPACE_ONLY',
            formatting: 'pretty_print',
            output_wrapper: '"%output%"'
          })
        },

        src: [
          'web/src/js/',
          'web/third-party/closure-library/closure/goog',
          'web/third-party/closure-library/third_party'
        ],

        dest: 'web/src/compiled/WebMessenger.js'
      }
    },

    closureDepsWriter: {
      options: {
        depswriter: 'web/third-party/closure-library/closure/bin/build/depswriter.py'
      },

      'WebMessenger': {
        options: {
          root_with_prefix: '"web/src/js/ ../../../../js/"'
        },
        dest: 'web/src/js/deps.js'
      }
    },

    jshint: {
      all: {
        src: ['Gruntfile.js', 'web/src/js/**/*.js'],
        options: {
          '-W069': true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-closure-tools');

  grunt.registerTask('default', ['closureDepsWriter']);
  grunt.registerTask('dist', ['closureDepsWriter', 'closureBuilder:simple', 'copy:dist', 'targethtml']);

  grunt.registerTask('compile', ['closureDepsWriter', 'closureBuilder:advance']);
  grunt.registerTask('compile:sim', ['closureDepsWriter', 'closureBuilder:simple']);
  grunt.registerTask('compile:debug', ['closureDepsWriter', 'closureBuilder:whitespace']);
};
