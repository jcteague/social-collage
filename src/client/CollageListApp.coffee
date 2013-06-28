define ['jquery','bootstrap', 'CollageList','EventEmitter','CollagePublishDialog'], ($,bootstrap,CollageList,event_emitter, CollagePublishDialog) ->
	$ ->
		console.log "collagelist app startup"
		collage_list = new CollageList()
		publish_dialog = new CollagePublishDialog()
	