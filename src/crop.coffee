require ['jquery','fabric'], ($,fabric)->
	class Crop
		constructor: (@canvas)->
			@selected_element = @canvas.getActiveObject()
			console.log @selected_element
			@crop_box = @create_cropping_box()
			# not working yet
			# @canvas.on 'object:scaling', @constrain_box_size
		constrain_box_size: (evt) =>
			box_bounds = evt.target.getBoundingRect()
			photo_bounds = @selected_element.getBoundingRect()
			if(box_bounds.left < photo_bounds.left)
				console.log "moved past picture left"
				@evt.target.set('lockScalingX',true)

		crop: ->
			console.log "cropping"
			@selected_element.set('angle',0)
			@crop_box.set('angle',0)
			@stage.renderAll()
			ctx = @canvas.getContext()
			img = @selected_element._element
			img_bounds = @selected_element.getBoundingRect()
			crop_bounds = @crop_box.getBoundingRect()
			crop_x =  Math.round(crop_bounds.left - img_bounds.left)
			crop_y =  Math.round(crop_bounds.top - img_bounds.top)
			crop_width = crop_bounds.width
			crop_height = crop_bounds.height
			console.log "#{crop_x}, #{crop_y},#{crop_width}, #{crop_height}"
			console.log "cropping bounds"
			# console.log crop_bounds
			# console.log img_bounds
			# @canvas.remove(@selected_element)
			@canvas.remove(@crop_box)
			@canvas.crop(@selected_element, crop_x,crop_y, crop_width,crop_height)
			@selected_element.set 'hasControls',true
			# ctx = @canvas.getContext()
			# ctx.drawImage(img,
			# 							crop_x, #clip x
			# 							crop_y, #clip y
			# 							crop_bounds.width, #clip width
			# 							crop_bounds.height, #clip height
			# 							0, #x
			# 							0,  #y
			# 							crop_bounds.width, #img width
			# 							crop_bounds.height, #img height
			# )

		create_cropping_box: ->
			
			cropping_rect = new fabric.Rect({
				top:@selected_element.top, 
				left:@selected_element.left,
				width:@selected_element.width,
				height: @selected_element.height,
				angle: @selected_element.angle,
				fill:"grey",
				opacity: .45,
				lockRotation: true
			})
			@canvas.add(cropping_rect)
			@selected_element.set 'hasControls',false
			return cropping_rect
	$ ->
			console.log  "crop test setup"
			f_cnvs = new fabric.Canvas("cnvs")
			img = document.getElementById("pic")
			f_img = new fabric.Image(img,{left:600,top:400,angle:0})
			f_cnvs.add(f_img)
			cropper = {}
			$('#add-crop').click () ->
				cropper = new Crop(f_cnvs)
			$('#crop').click ()->
				cropper.crop()

		
		
	

