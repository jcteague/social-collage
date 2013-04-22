define ['EventEmitter','Collage','Toolbar','Commands'],(event_emitter,Collage,Toolbar, commands) ->
	class App
		constructor: (@canvas_element) ->
			@collage = new Collage(@canvas_element)
			@toolbar = new Toolbar('#collage-menu-list .menu-item',"move")
			
