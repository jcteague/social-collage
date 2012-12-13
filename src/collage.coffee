define ['jqueryUI','kinetic','EventEmitter','Photo'], ($,Kinetic,event_emitter,Photo) ->
	class Collage
		constructor: (@canvas_element)->
			@canvas = $("##{@canvas_element}")
			@stage = new Kinetic.Stage({container:canvas_element,width:600 ,height:500})
			@layer = new Kinetic.Layer();
			@container = new Kinetic.Container();
			@stage.add(@layer);

			@activeImage = null;
			@images = []
			@canvas.on "click",(evt) =>
				console.log "canvas clicked"
				cnvs_item =  @container.getIntersections(evt.offsetX,evt.offsetY)
				if @currentItem? && cnvs_item.length == 0
					console.log(@currentItem)
					@currentItem.noLongerActive();
					@currentItem = null
			image_dropped = (evt,ui) =>
				console.log("photo image dropped")
				img = $(ui.draggable)
				img_data =
				  offsetX:  evt.offsetX
				  offsetY: evt.offsetY
				  data: img.data('img_data')
				console.log(img_data)
				@addFbPhoto(img_data)
			
			@canvas.find('canvas').droppable({drop: image_dropped})

			event_emitter.on "ItemSelected",(type, item) =>
				console.log("Item Selected Event");
				@currentItem?.noLongerActive();
				@currentItem = item;
			event_emitter.on "rotation.changed", (value) =>
				@currentItem?.rotate(value)
			
		dimensions: ->
			@stage.getSize();

		screenPosition: ->
			@canvas.position();

		addImage: (imageSrc) ->
			console.log("adding image");
			onImageCreated = (k_image) =>
				@container.add(k_image)
				@layer.add(k_image)
				@stage.draw()

			canvas_image = new Photo(imageSrc,onImageCreated)
			@images.push(canvas_image);



		addFbPhoto: (image_data) ->
			collage_dimensions = @dimensions();
			imageToAdd = _.find image_data.data.images,(image) ->
				image.width <= collage_dimensions.width && image.height <= collage_dimensions.height
			@addImage(
				{
					src:imageToAdd.source,
					width:imageToAdd.width,
					height:imageToAdd.height,
					x:image_data.offsetX,
					y:image_data.offsetY
				}
			)
	

	


