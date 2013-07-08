define ['jquery','App','ColorPicker','EventEmitter'], ($,App, colorpicker,event_emitter) ->
	console.log "editor app loaded"
	$ ->
		app = new App('collage-canvas')
		console.log("loading dependencies")
		$('.color').colorpicker()
		$(window).on "resize", (evt) -> event_emitter.emit "WindowResized", evt


