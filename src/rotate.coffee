define ['underscore','RotateSlider'], (_,RotateSlider) ->
	bind_to : (collage_item) ->

		console.log("rotating")
		item_position = collage_item.getScreenPosition()
		item_dimensions = collage_item.getItemDimensions()
		sliderOptions =
			top: item_position.y + item_dimensions.height / 2

			left: item_position.x
			width:item_dimensions.width
		@slider = new RotateSlider(sliderOptions)
		
	
	unbind: (collage_item) ->
		@slider.hide()


