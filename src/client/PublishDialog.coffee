define ['jquery','EventEmitter'],($,event_emitter) ->
	
	$ ->
		$('#publish-collage').click (evt)->
			evt.preventDefault()
			photo_id = $(@).attr("data-photoid")
			console.log "publish collage: #{photo_id}"
			event_emitter.emit "PublishCollageClicked",{destination:"facebook",photoId: photo_id}
			$('#publishModal').modal('hide')
	
	display = (collage) ->
		img = document.getElementById "collage-preview"
		img.src = collage.getPreviewImage()
		
		$('#publishModal').modal('show')
