define ['jquery','EventEmitter'],($,event_emitter) ->

	display = (collage) ->
		img = document.getElementById "collage-preview"
		img.src = collage.getPreviewImage()
		
		$('#publishModal').modal('show')
