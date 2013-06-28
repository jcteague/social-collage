define ['jquery','EventEmitter'], ($, event_emitter) ->
	class CollagePublishDialog
		constructor: ->
			
			@modal = $('#publish-collage-modal')
			@preview_buttons = $('.modal-footer .preview button')
			$('#save-collage').click @on_save_collage
			@comment = $('#publish-comments')
			event_emitter.on 'PublishButtonClicked', @show
			event_emitter.on 'loading.photo.publish.completed', @show_saved
			
		reset: ->
			@modal.find('.preview').show()
			@preview_buttons.removeAttr('disabled')
			@modal.find('.saved').hide()
			@modal.find('.loading').hide()


		show: (@collage_data) =>
			@reset()
			$('#collage-preview').css 'background-image', "url('#{@collage_data.url}')"
			console.log "showing publish modal #{@collage_data}"
			@modal.modal('show')
		show_loading: =>
			@modal.find('.preview').hide()
			@modal.find('.loading').show()
		show_saved: =>
			console.log "publish complted"
			@modal.find('.preview').hide()
			@modal.find('.saved').show()


		
		on_save_collage: (evt) =>
			@show_loading()
			@preview_buttons.attr('disabled')
			comment = @comment.val()
			url = @collage_data.url
			collage_id = @collage_data.id
			event_emitter.emit "PhotoPublishClicked", {id:collage_id,url:url,comment:comment}


