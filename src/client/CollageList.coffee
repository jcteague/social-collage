define ['jquery','UserPhotos','EventEmitter'], ($, UserPhotos,event_emitter) ->
	class CollageList
		constructor: ->
			console.log "collage list setup"
			@user_photos = new UserPhotos();
			@publish_btn = $('.start-publish')
			@publish_btn.click @handle_publish_click

		handle_publish_click: (evt) =>
			el = $(evt.currentTarget)
			collage_id = el.attr('data-id');
			collage_url = el.attr('data-photourl')
			console.log "publish: #{collage_id}"
			event_emitter.emit "PublishButtonClicked",{id:collage_id, url:collage_url}
