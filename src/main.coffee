requirejs.config(
	{
		paths:
			"jquery": "jquery-1.7.2.min",
			"underscore": "underscore-min",
			"jqueryUI": "jqueryui-min",
			"bootstrap": "bootstrap",
			"EventEmitter2": "eventemitter2",
			"kinetic": "kinetic-v4.4.1",
			"sylvester": "sylvester"
		shim:
			underscore:{exports:'_'},
			kinetic:{exports:'Kinetic'},
			jqueryUI:{exports:'$',deps:['jquery']}
			EventEmitter2: {exports:"EventEmitter2"}
		
	}
	
)
require ['jquery','UserPhotos','App'],($, UserPhotos,App)->
	$ ->
		userPhotos = new UserPhotos()
		app = new App('canvas-container')
		console.log("loading dependencies")
		
