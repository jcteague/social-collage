App.RotateSlider = class RotateSlider
	constructor: (@container, @event_emmitter) ->
		@slide_element = $('<div id="rotate-slider" class="slider">').slider({
				min:-180
				max:180
				slide: @onSlide
			})
		@rotate_value_element = $('<span id="#rotate-value">').text('0');

		$("##{@container}").append(@slide_element).append(@rotate_value_element)
	onSlide: (evt,ui) =>

		console.log("slide")
		
	
		@rotate_value_element.text(ui.value) 
		@event_emmitter.emit("rotation.changed",ui.value)





