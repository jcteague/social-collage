App.Photo = class Photo 

	constructor: (image_data,onImageLoaded) ->
		@deSelectSteps = []
		img = new Image()
		@group = new Kinetic.Group({draggagle:true})
		img.onload = () =>
			@item = new Kinetic.Image({
				image:img,
				x: image_data.x,
				y: image_data.y,
				width: image_data.width,
				height: image_data.height,
				name:'image',
				draggagle: true
			})
			@group.add(@item)
			@add_corners()	
			@item.on 'click', =>
				app.event_emitter.emit("ItemSelected","Image",@)

			onImageLoaded(@group)
		img.src = image_data.src;
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

