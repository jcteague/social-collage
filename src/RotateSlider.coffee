define ['jquery','EventEmitter'], ($, event_emitter) ->

	class RotateSlider
		constructor: (options) ->
			@container = $('#rotater')
			@slider = $('#rotate-slider').slider({
					min:-180
					max:180
					slide: @onSlide
				})
			@rotate_value_element = $('#rotate-value').text('0');
			@container.offset({top:options.top,left:options.left}).width(options.width)

		onSlide: (evt,ui) =>
			console.log("slide")
			@rotate_value_element.text(ui.value) 
			event_emitter.emit("rotation.changed",ui.value)





