define ['jquery','App','ColorPicker'], ($,App) ->
	console.log "editor app loaded"
	$ ->
		app = new App('collage-canvas')
		console.log("loading dependencies")
		$('.color').colorpicker()

