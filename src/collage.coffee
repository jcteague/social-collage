define ['jqueryUI','kinetic','EventEmitter','Photo'], ($,Kinetic,event_emitter,Photo) ->
	class Collage
		constructor: (@canvas_element)->
			@canvas = $("##{@canvas_element}")
			@stage = new Kinetic.Stage({container:canvas_element,width:@canvas.width() ,height:@canvas.height()})
			@layer = new Kinetic.Layer();
			@container = new Kinetic.Container();
			@stage.add(@layer);

			@activeImage = null;
			@collage_items = []
			
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

			@canvas.on "click",(evt) =>
				console.log "canvas clicked"
				cnvs_item =  @find_item(evt.offsetX,evt.offsetY)
				
				#currentItem exist and no 
				if @currentItem? && cnvs_item?.length == 0
					console.log("de selecting current canvas item")
					event_emitter.emit 'ItemDeSelected', @currentItem
					
					@currentItem = null
				else
					console.log("collage item selected")
					console.log(cnvs_item)
					@currentItem = cnvs_item
					event_emitter.emit "ItemSelected", @currentItem.itemType, @currentItem

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
			@collage_items.push(canvas_image);

		find_item: (x,y) ->
			(i for i in @collage_items when i.intersects(x,y))[0]

		addFbPhoto: (image_data) ->
			collage_dimensions = @dimensions();
			imageToAdd = _.find image_data.data.images,(image) ->
				image.width <= collage_dimensions.width && image.height <= collage_dimensions.height
			@addImage(
				{
					src:'/images?src='+imageToAdd.source,
					width:imageToAdd.width,
					height:imageToAdd.height,
					x:image_data.offsetX,
					y:image_data.offsetY
				}
			)
	

	


