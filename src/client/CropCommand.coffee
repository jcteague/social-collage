define ['fabric','EventEmitter'], (fabric,event_emitter)->
	class CropCommand
		constructor: (@on_applied, @on_deactivate) ->

		lock_item: (img, stage) ->
			img.set	'lockMovementX', true
			img.set	'lockMovementY', true
			img.set	'lockRotation', true
			img.set	'lockScalingX', true
			img.set	'lockScalingY', true
			img.set	'hasControls', false
		reset_img: (img) ->
			img.set	'lockMovementX', false
			img.set	'lockMovementY', false
			img.set	'lockRotation', false
			img.set	'lockScalingX', false
			img.set	'lockScalingY', false
			img.set	'hasControls', true

		activate: (@canvas_item ) ->
				@stage = @canvas_item.stage
				console.log @canvas_item
				f_img = @canvas_item.item
				@lock_item(f_img, @stage)
				img_bounds = f_img.getBoundingRect()

				@cropping_rect = new fabric.Rect({
					top: f_img.top, 
					left: f_img.left,
					width: f_img.width-1,
					height: f_img.height-1,
					angle: f_img.angle,
					scaleX: f_img.scaleX,
					scaleY: f_img.scaleY,
					fill:"grey",
					opacity: .6,
					lockRotation: true
				})
				@stage.add(@cropping_rect)
				@stage.setActiveObject(@cropping_rect)
				# @stage.renderAll()

				event_emitter.on 'submenu.apply.crop', () =>
					crop_image = @canvas_item.item
					crop_image_bounds = crop_image.getBoundingRect()
					img_angle = f_img.get 'angle'
					
					crop_bounds = @cropping_rect.getBoundingRect()
					
					crop_x =  Math.round(crop_bounds.left - crop_image_bounds.left)
					crop_y =  Math.round(crop_bounds.top - crop_image_bounds.top)
					crop_width = Math.round crop_bounds.width 
					crop_height = Math.round crop_bounds.height
					

					console.log "imag bounds"
					console.log crop_image_bounds
					console.log "cropping"
					console.log crop_image
					@stage.remove @cropping_rect
					@reset_img crop_image
					crop_dimensions = {x: crop_x, y: crop_y, width: crop_width,height:crop_height }
					console.log crop_dimensions
					@stage.crop(crop_image, crop_dimensions)
					# @stage.crop(f_img, {x: 178, y: 134, width: 541.4563,height:405.53436 })
					
					
					@on_applied()
				event_emitter.on 'submenu.cancel.crop', () =>
					@deactivate()
				
			
			deactivate: (canvas_item) ->
				@stage.remove @cropping_rect
				@reset_img @canvas_item.item
				@stage.renderAll()
				@on_deactivate()

		
		

	