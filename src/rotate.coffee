define ['underscore','RotateSlider'], (_,RotateSlider) ->
	class
		@bind_to : (collage_item) ->

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
			
			
			
			# canvas_item.on "dragstart", ->
			# 	canvas_group.setDraggable false
			# 	drag_start_position.x = c.attrs.x
			# 	drag_start_position.y = c.attrs.y

			# canvas_item.on "dragend", ->
			# 	canvas_group.setDraggable true

			# canvas_item.on "dragmove", (evt)->
			# 	console.log(this)
			# 	console.log "drag start #{drag_start_position.x}, #{drag_start_position.y}"
			# 	start_vector = Vector.create([drag_start_position.x,drag_start_position.y])
			# 	current_vector = Vector.create([this.attrs.x,this.attrs.y])
			# 	theta = current_vector.angleFrom(start_vector);
			# 	console.log("theta: #{theta * 360/Math.PI}")
			# 	canvas_group.rotate(theta)

			canvas_item.getLayer().draw()

