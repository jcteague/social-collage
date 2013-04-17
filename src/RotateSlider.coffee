define ['jquery','EventEmitter'], ($, event_emitter) ->

	class RotateSlider
		constructor: (options) ->
			@container = $('#rotater')
			@slider = $('#rotate-slider')
			if(@slider.hasClass 'ui-slider')
				console.log "slider exists"
				@slider.show()
				return

			@slider.slider({
					min:-180
					max:180
					slide: @onSlide
				})
			@container.offset({top:options.top,left:options.left}).width(options.width)


		onSlide: (evt,ui) =>
			console.log("slide")
			event_emitter.emit("rotation.changed",ui.value)

		hide: ->	
			@slider.hide()





