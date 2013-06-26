define ['jquery','EventEmitter'],($,event_emitter) ->
	
	$ ->
		$('#publishModal .preview').show()
		$('#publishModal .saved').hide()
		$('#save-collage').click (evt)->
			evt.preventDefault()
			photo_id = $(@).attr("data-photoid")
			console.log "publish collage: #{photo_id}"
			event_emitter.emit "PublishCollageClicked",{destination:"facebook",photoId: photo_id}
			
	# event_emitter.on "ShowPublishDialogClicked", =>
	# 	toggle_sections()
	event_emitter.on "loading.photo.save.completed", =>
		toggle_sections()
	
	toggle_sections = () ->
		$('#publishModal .preview').toggle()
		$('#publishModal .saved').toggle()

	display = (collage) ->
		img = document.getElementById "collage-preview"
		img.src = collage.getPreviewImage()
		
		$('#publishModal').modal('show')
