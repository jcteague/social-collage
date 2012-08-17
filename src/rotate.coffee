App.Commands.Rotate =
	action : (collage_item) ->

		console.log("rotating")
		canvas_group = collage_item.group
		canvas_item = collage_item.item
		corners = (collage_item.corners[c] for c of collage_item.corners)
		image_center = 
			x: canvas_item.attrs.x + (canvas_item.attrs.width / 2)
			y: canvas_item.attrs.y + (canvas_item.attrs.height / 2)
		center_vector = Vector.create([image_center.x,image_center.y])

		console.log(image_center)
		drag_start_position = {x:0,y:0}
		_.each corners, (c)->
			c.show()
			c.on "dragstart", ->
				canvas_group.setDraggable false
				drag_start_position.x = c.attrs.x
				drag_start_position.y = c.attrs.y

			c.on "dragend", ->
				canvas_group.setDraggable true

			c.on "dragmove", (evt)->
				console.log(this)
				console.log "drag start #{drag_start_position.x}, #{drag_start_position.y}"
				start_vector = Vector.create([drag_start_position.x,drag_start_position.y])
				current_vector = Vector.create([this.attrs.x,this.attrs.y])
				theta = current_vector.angleFrom(start_vector);
				console.log("theta: #{theta * 360/Math.PI}")
				canvas_group.rotate(theta)

		canvas_item.getLayer().draw()

