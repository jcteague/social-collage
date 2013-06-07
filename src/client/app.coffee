define ['EventEmitter','Collage','Toolbar','PhotoGallery','PublishDialog'],(event_emitter,Collage,Toolbar, photoGallery, publishDialog) ->
	class App
		constructor: (@canvas_element) ->
			@collage = new Collage(@canvas_element)
			@toolbar = new Toolbar('#toolbar')

			# diagnostics = $('<div>',{id:"diagnostics"})
			# diagnostics.append """
			# 	<h3>diagnostics</h3>
			# 	<div>
			# 		<span>canvas mouse: x: <span id="canvas-mouse-x"></span>,y:<span id="canvas-mouse-y"></span></span>
			# 	</div>"""
			# $('body').append(diagnostics)
			event_emitter.on "canvas:mousemove",(evt) ->
				$('#canvas-mouse-x').text(evt.x)
				$('#canvas-mouse-y').text(evt.y)
			event_emitter.on "PublishCollageClicked", =>
				publishDialog(@collage)



					

			
			
