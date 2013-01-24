define ['jquery','kinetic','EventEmitter'], ($,Kinetic,event_emitter) ->
	class Photo 

		constructor: (image_data,onImageLoaded) ->
			@deSelectSteps = []
			@img = new Image()
			@group = new Kinetic.Group({draggagle:true})
			@img.onload = () =>
				@image_center = 
					x: image_data.width /2,
					y: image_data.height / 2
				
				@item = new Kinetic.Image({
					image:@img,
					x: image_data.x
					y: image_data.y
					width: image_data.width,
					height: image_data.height,
					name:'image',
					draggagle: true,
				  
				})
				@group.add(@item)
				@add_corners()	
				@item.on 'click', =>
					console.log('Image Clicked')
					event_emitter.emit("ItemSelected","Image",@)

				onImageLoaded(@group)
			@img.src = image_data.src;
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

		noLongerActive: ->
			corner.hide() for x, corner of @corners
			@group.setDraggable(true)
			@group.getLayer().draw()
		rotate: (degree) ->
			@group.setOffset(@image_center.x,@image_center.y)
			@group.setPosition(@image_center.x,@image_center.y)
			cr = @group.getRotationDeg()
			dr = (degree - cr)
			new_rotation = cr + dr
			console.log("photo: rotating #{new_rotation}")
			
			@group.setRotationDeg(new_rotation)
			@group.getLayer().draw()
			@group.setOffset(0,0)
			
			


