App.Collage = class Collage
	constructor: (@canvas_element, @event_emitter)->
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
		

		@event_emitter.on "ItemSelected",(type, item) =>
			console.log("Item Selected Event");
			@currentItem?.noLongerActive();
			@currentItem = item;
		
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

		canvas_image = new App.Photo(imageSrc,onImageCreated)
		@images.push(canvas_image);



	addFbPhoto: (image_data) ->
		collage_dimensions = @dimensions();
		imageToAdd = _.find image_data.fbData.images,(image) ->
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
	

	


