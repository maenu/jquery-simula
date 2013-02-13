module.exports = function(grunt) {
	grunt.initConfig({
		meta: {
			package: grunt.file.readJSON('package.json'),
			src: {
				main: 'src/main',
				test: 'src/test',
			},
			bin: {
				coverage: 'bin/coverage'
			},
			doc: 'doc',
			lib: {
				main: 'lib/main'
			}
		},
		clean: {
			bin: 'bin',
			doc: 'doc'
		},
		jasmine: {
			coverage: {
				src: '<%= meta.src.main %>/js/*.js',
				options: {
					specs: '<%= meta.src.test %>/js/*.js',
					vendor: '<%= meta.lib.main %>/*.js',
					template: require('grunt-template-jasmine-istanbul'),
					templateOptions: {
						coverage: '<%= meta.bin.coverage %>/coverage.json',
						report: '<%= meta.bin.coverage %>'
					}
				}
			}
		},
		uglify: {
			options: {
				banner: '/**\n'
						+ ' * <%= meta.package.name %> v<%= meta.package.version %>\n'
						+ ' * built on ' + '<%= grunt.template.today("dd.mm.yyyy") %>\n'
						+ ' * Copyright <%= grunt.template.today("yyyy") %> <%= meta.package.author.name %>\n'
						+ ' * licenced under MIT, see LICENSE.txt\n'
						+ ' */\n'
			},
			min: {
				files: {
					'<%= meta.package.name %>-<%= meta.package.version %>.min.js': '<%= meta.src.main %>/js/*.js'
				}
			}
		},
		yuidoc: {
			compile: {
				name: '<%= meta.package.name %>',
				description: '<%= meta.package.description %>',
				version: '<%= meta.package.version %>',
				options: {
					paths: '<%= meta.src.main %>',
					outdir: '<%= meta.doc %>'
				}
			}
		},
		jshint: {
			main: '<%= meta.src.main %>/js/*.js',
			test: '<%= meta.src.test %>/js/*.js',
			options: {
				// restrict
				bitwise: false,
				camelcase: true,
				curly: true,
				eqeqeq: false,
				forin: true,
				immed: true,
				indent: 4,
				latedef: true,
				newcap: true,
				noarg: true,
				noempty: true,
				nonew: true,
				plusplus: false,
				quotmark: 'single',
				regexp: true,
				undef: true,
				unused: true,
				strict: false,
				trailing: true,
				maxparams: 5,
				maxdepth: 3,
				maxstatements: 42,
				maxcomplexity: 5,
				maxlen: 80,
				// relax
				sub: true,
				eqnull: true,
				laxbreak: true, // break on + etc.
				// environments
				browser: true,
				globals: {
					'jQuery': true
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	
	grunt.registerTask('checkStyle', ['jshint:main', 'jshint:test']);
	grunt.registerTask('test:coverage', 'jasmine:coverage');
	grunt.registerTask('min', 'uglify:min');		
	grunt.registerTask('doc', 'yuidoc');
};