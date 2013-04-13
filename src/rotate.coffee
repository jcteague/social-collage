define ['underscore','RotateSlider'], (_,RotateSlider) ->
	bind_to : (collage_item) ->

		console.log("rotating")
		canvas_group = collage_item.group
		canvas_item = collage_item.item
		item_position = collage_item.getScreenPosition()
		item_dimensions = collage_item.getItemDimensions()
		sliderOptions =
			top: item_position.y + item_dimensions.height / 2

			left: item_position.x
			width:item_dimensions.width
		@slider = new RotateSlider(sliderOptions)
		
		canvas_item.getLayer().draw()
	unbind: (collage_item) ->
		@slider.hide()


