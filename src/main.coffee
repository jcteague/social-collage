requirejs.config(
	{
		paths:
			"jquery": "jquery-1.7.2.min",
			"underscore": "underscore-min",
			"jqueryUI": "jqueryui-min",
			"bootstrap": "bootstrap",
			"eventEmitter": "eventemitter2",
			"kinetic": "kinetic-min",
			"sylvester": "sylvester"
		shim:
			underscore:{exports:'_'},
			kinetic:{exports:'Kinetic'},
			jqueryUI:{exports:'$',deps:['jquery']}

		
	}
	
)
require ['jquery','UserPhotos'],($, UserPhotos)->
	$ ->
		userPhotos = new UserPhotos()
		console.log("loading dependencies")
		
