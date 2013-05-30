'use strict'
module.exports = function(grunt){
	grunt.loadNpmTasks('grunt-mocha-test')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-contrib-jshint')
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		jshint:{
			all:['**/*.js']
		},

		watch:{
			
				files:['**/*.js'],
				tasks: ['mochaTest']
		},

		mochaTest: {
			test: {
				options:{
					reporter: 'spec'
				},
				src: ['test/**/*.js', 'test/**/*.coffee']
			}
		}	
	});

	grunt.registerTask('default',['mochaTest'])
	// grunt.registerTask('watch')

	

}