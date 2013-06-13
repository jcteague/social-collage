'use strict'
module.exports = function(grunt){
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-coffee');

	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		jshint:{
			all:['src/**/*.js']
		},
		coffee:{
			glob_to_multiple:{
				
					expand:true,
					flatten:true,
					cwd: 'src/client',
					src: ['*.coffee'],
					dest: 'public/javascripts',
					ext: '.js'
				
			}
		},
		watch:{
			
				files:['src/**/*.js', 'src/**/*.coffee'],
				tasks: ['mochaTest', 'coffee']
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