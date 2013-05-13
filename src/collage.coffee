define ['jqueryUI','fabric','EventEmitter','Photo'], ($,fabric,event_emitter,Photo) ->
	class Collage
		constructor: (@canvas_element)->
			@canvas = $("##{@canvas_element}")
			@canvas_container = @canvas.parent()
			@stage = new fabric.Canvas(@canvas_element)


			@stage.setWidth(@canvas_container.width())
			@stage.setHeight(@canvas_container.height())
			@enableDiagnostics()
			@activeImage = null;
			@collage_items = []
			
			image_dropped = (evt,ui) =>
				console.log("photo image dropped")
				console.log "event position"
				console.log ui.position
				console.log "fabric mouse position"
				mouse_position =  @stage.getPointer()
				img = $(ui.draggable)
				img_data =
				  x: mouse_position.x
				  y: mouse_position.y
				  data: img.data('img_data')
				console.log(img_data)
				@addFbPhoto(img_data)
			
			@canvas.droppable({drop: 	image_dropped})
		# 	 observe('selection:cleared');
  # observe('selection:created');
			@stage.on "selection:created", (evt) =>
				console.log "object selected"
				console.log evt
			@stage.on "selection:cleared", (evt) =>
				console.log "object selection cleared"
				console.log evt


			# @stage.on "mouse:up",(evt) =>
			# 	console.log "canvas clicked"
			# 	console.log evt
			# 	cnvs_item =  @find_item(evt.offsetX,evt.offsetY)
				
			# 	#currentItem exist and no 
				
			# 	if @currentItem? and not cnvs_item?
			# 		console.log("de selecting current canvas item")
			# 		event_emitter.emit 'ItemDeSelected', @currentItem
					
			# 		@currentItem = null
			# 	else
			# 		console.log("collage item selected")
			# 		console.log(cnvs_item)
			# 		@currentItem = cnvs_item
			# 		event_emitter.emit "ItemSelected", @currentItem

			
				
		dimensions: ->
			{
				width: @stage.getWidth()
				height: @stage.getHeight()
			}

		screenPosition: ->
			@canvas.position();

		addImage: (imageSrc) ->
			console.log("adding image");
			console.log imageSrc
			photo_id = @collage_items.length+1
			@collage_items.push(new Photo photo_id, imageSrc,@stage,(cnvs_image) =>
				console.log cnvs_image
				@stage.add(cnvs_image)
				return)

			

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
					x:image_data.x + (imageToAdd.width/2),
					y:image_data.y + (imageToAdd.height/2)
				}
			)
		enableDiagnostics: ->
			@stage.on("mouse:move",(evt)->
				
				event_emitter.emit "canvas:mousemove",{x:evt.e.offsetX,y:evt.e.offsetY})

	

	


