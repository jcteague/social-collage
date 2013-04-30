define ['EventEmitter','Collage','Toolbar','PhotoGallery'],(event_emitter,Collage,Toolbar, photoGallery) ->
	class App
		constructor: (@canvas_element) ->
			@collage = new Collage(@canvas_element)
			@toolbar = new Toolbar('#collage-menu-list .menu-item',"move")
			
			
