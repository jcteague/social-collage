define ['jquery','fabric','EventEmitter'], ($,fabric,event_emitter) ->
	class Photo 

		constructor: (@id, image_data,@stage, onImageLoaded) ->
			@itemType = 'Photo'	
			@loadImage(image_data,onImageLoaded)
			
		get_center: ->
			{
				x: @item.getX() + (@item.getWidth()/2)
				y: @item.getY() + (@item.getHeight()/2)
			}
		loadImage: (image_data, loaded_cb) ->
			console.log "photo loadImage: "
			console.log image_data
			event_emitter.emit "loading.photo.started"
			new fabric.Image.fromURL(image_data.src, 
				(f_img) =>
					@item = f_img
					@item.on "selected", (evt) =>
						console.log "photo selected"
						console.log evt
						event_emitter.emit "ItemSelected", @
					loaded_cb @item
					event_emitter.emit "loading.photo.completed"
					@item.on "selected:cleared", (evt) =>
						console.log  "photo selected cleared"
						event_emitter.emit 'ItemDeSelected', @
				
				,{
					left: image_data.x
					top: image_data.y
					width: image_data.width,
					height: image_data.height,
				}
			)
			
		

		intersects: (x,y)->
			x1 = @item.attrs.x
			x2 = x1+@item.attrs.width
			y1 = @item.attrs.y
			y2 = y1+@item.attrs.height
			x1 < x < x2 and y1 < y < y2
			

		noLongerActive: ->
			corner.hide() for x, corner of @corners
			# @group.setDraggable(true)
			# @group.getLayer().draw()

		getCanvasPosition: ->
			# @item.getOffset()

		getScreenPosition: ->
			cnvs_position = $(@item.getCanvas().element).offset()
			img_position = @item.getAbsolutePosition()
			{
				x: cnvs_position.left+img_position.x,
				y: cnvs_position.top+img_position.y
			}
		getItemDimensions: ->
			 {
			 		width: @item.getWidth()
			 		height: @item.getHeight()
			 }

