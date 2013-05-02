requirejs.config(
	{
		paths:
			"jquery": "jquery-1.7.2.min",
			"underscore": "underscore-min",
			"jqueryUI": "jqueryui-min",
			"bootstrap": "bootstrap",
			"EventEmitter2": "eventemitter2",
			"async": "async"			
			"fabric": "fabric"
			"sylvester": "sylvester"
		shim:
			underscore:{exports:'_'},
			fabric: {exports:'fabric'}
			jqueryUI:{exports:'$',deps:['jquery']}
			EventEmitter2: {exports:"EventEmitter2"}
			async: {exports:"async"}
		
	}
	
)
require ['jquery','UserPhotos','App'],($, UserPhotos,App)->
	$ ->
		userPhotos = new UserPhotos()
		app = new App('collage-canvas')
		console.log("loading dependencies")
		
