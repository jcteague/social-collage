requirejs.config(
	{
		paths:
			"jquery": "jquery-1.7.2.min",
			"underscore": "underscore-min",
			"jqueryUI": "jqueryui-min",
			"bootstrap": "bootstrap",
			"EventEmitter2": "eventemitter2",
			"async": "async",			
			"fabric": "fabric",
			"sylvester": "sylvester",
			"wijmoUtil": "jquery.wijmo.wijutil.min",
			"wijmoSplitter": "jquery.wijmo.wijsplitter.min"
	    
			
		shim:
			underscore:{exports:'_'},
			fabric: {exports:'fabric'},
			jqueryUI:{exports:'$',deps:['jquery']},
			EventEmitter2: {exports:"EventEmitter2"},
			async: {exports:"async"},
			wijmoUtil: {exports: "wijmoUtil", deps:["jquery"]},
			wijmoSplitter: { exports: "wijmoSplitter", deps:["jqueryUI","wijmoUtil"]}
		
	}
	
)
require ['jquery','UserPhotos','App',"wijmoSplitter"],($, UserPhotos,App, spliter)->
	$ ->
		userPhotos = new UserPhotos()
		app = new App('collage-canvas')
		console.log("loading dependencies")
		# $('#page-splitter').wijsplitter({
		# 	spliterDistance:600,
		# 	resizable:true,
		# 	orientation:"vertical",
		# 	panel2:{maxSize:400}
		# 	collapsingPanel:"panel2",
		# 	fullSplit:true})
		
