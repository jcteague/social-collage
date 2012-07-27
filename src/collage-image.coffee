App.Photo = class Photo 

	constructor: (image_data,onImageLoaded) ->
		img = new Image()
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
			@item.on 'click', =>
				app.event_emitter.emit("ItemClicked","Image",@)
			onImageLoaded(@item)
		img.src = image_data.src;
	
	