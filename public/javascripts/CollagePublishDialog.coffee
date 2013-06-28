define ['jquery','EventEmitter'], ($, event_emitter) ->
	class CollagePublishDialog
		constructor: ->
			@modal = $('#publish-collage-modal')
		show: (@collage_id, @collage_url) ->
			@modal.modal('show')
