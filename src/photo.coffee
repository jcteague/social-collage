define ['jquery','kinetic','EventEmitter'], ($,Kinetic,event_emitter) ->
	class Photo 

		constructor: (image_data,@stage, onImageLoaded) ->
			@itemType = 'Photo'
			@deSelectSteps = []
			@img = new Image()
			@group = new Kinetic.Group({draggagle:true})
			
			@img.onload = () =>
				@loadImage(image_data)
				onImageLoaded(@group)
			
			@img.src = image_data.src;
		draw:	 ->
			# @group.getLayer().draw()
			@group.getStage().draw()
		
		get_center: ->
			{
				x: @item.getX() + (@item.getWidth()/2)
				y: @item.getY() + (@item.getHeight()/2)
			}
		loadImage: (image_data) ->
			
				
				@item = new Kinetic.Image({
					image:@img,
					x: image_data.x
					y: image_data.y
					width: image_data.width,
					height: image_data.height,
					name:'image',
					draggagle: true,
					stroke: 'black',
					strokeWidth: 2
				  
				})
				@group.add(@item)
				
				
				@add_corners()
				center_point = new Kinetic.Circle({radius:5,x:@get_center().x,y:@get_center().y,fill:"blue"})
				@group.add(center_point)

				
		add_corners: ->
			getAnchor = (x,y,name) ->
				return new Kinetic.Rect({
					x:x,
					y:y,
					name:name,
					fill:'#000000',
					width: 12,
					height: 12,
					visible:false
					draggable:true
				});
			item_position = @item.getPosition();
			@corners = 
				tl: getAnchor(item_position.x-6,item_position.y-6,'topLeft');
				tr: getAnchor(item_position.x+@item.getWidth()-6,item_position.y-6,'topRight');
				bl: getAnchor(item_position.x-6,item_position.y-6+@item.getHeight(),'bottomRight');
				br: getAnchor(item_position.x+@item.getWidth()-6,item_position.y-6+@item.getHeight(),'bottomLeft');
			
			
			@group.add(v) for k,v of @corners

		intersects: (x,y)->
			x1 = @item.attrs.x
			x2 = x1+@item.attrs.width
			y1 = @item.attrs.y
			y2 = y1+@item.attrs.height
			x1 < x < x2 and y1 < y < y2
			

		noLongerActive: ->
			corner.hide() for x, corner of @corners
			@group.setDraggable(true)
			@group.getLayer().draw()

		getCanvasPosition: ->
			@item.getOffset()

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


		rotate: (degree) ->
			center = @get_center()
			@group.setOffset(center.x,center.y)
			@group.setPosition(center.x,center.y)
			
			cr = @group.getRotationDeg()
			dr = (degree - cr)
			new_rotation = cr + dr
			console.log("photo: rotating #{new_rotation}")
			@group.setRotationDeg(new_rotation)
			# @group.getLayer().draw()
			# @group.setOffset(0,0)
			console.log "photo: resetting after rotation, before reset: #{@group.attrs.x},#{@group.attrs.y}"
			# @group.setPosition(original_position)
			console.log "photo: resetting after rotation: #{@group.attrs.x},#{@group.attrs.y}"
			@group.getLayer().draw()
			


