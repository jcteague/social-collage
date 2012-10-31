
window.fbAsyncInit  = ->
		FB.init(
			appId      : '236634053108854', # App ID
			channelUrl : '//localhost/channel.html', # Channel File
			status     : true, # check login status
			cookie     : true, # enable cookies to allow the server to access the session
			xfbml      : true  # parse XFBML
		)
		FB.getLoginStatus((response)->
			if response.status is 'connected'
				console.log("facebook connected")
				initialize()
			else
				facebookLogin();
		)
((d) ->
	id = 'facebook-jssdk'
	ref = d.getElementsByTagName('script')[0]
	if(d.getElementById(id))
		return
	js = d.createElement 'script'
	js.id = id
	js.async = true
	js.src = '//connect.facebook.net/en_US/all.js'
	ref.parentNode.insertBefore js, ref
)(document)

facebookLogin = () ->
	FB.login (response) ->
		if response.authResponse then
			#loadUser()
	 
initialize = (authResponse)->
	console.log("initializing photos")
	FB.api '/me/photos',(response)->
		pics = $('#your-pics')
		_.each response.data, (item) ->
			img_el = $("<img src=#{item.picture}' class='picture'>")
			img_el.draggable({cursor:'move',cursorAt:{top:0,left:0},revert:'invalid',helper:'clone'})
			img_el.data('fb_data',item)
			pics.append(img_el);  


requirejs.config({
		paths:
			"jquery": "jquery-1.7.2.min",
			"underscore": "underscore-min",
			"jqueryUI": "jqueryui-min",
			"bootstrap": "bootstrap",
			"eventEmitter": "eventemitter2",
			"kinetic": "kinetic-min",
			"sylvester": "sylvester",
	},
	shim:{
		underscore:{exports:'_'},
		kinetic:{exports:'Kinetic'},
		
	}
	)
require ['jquery','kinetic','underscore-min'],($, k,_)->
	$->
		console.log("loading dependencies")
		console.log($)
		console.log(k)
		console.log(_)



class App
	constructor: (@canvas_element, @event_emitter) ->
		@collage = new App.Collage(@canvas_element, @event_emitter)
		@collageItemClick = App.Commands.Resize.action
		event_emitter.on "ItemSelected", @onCanvasItemClick
		event_emitter.on "Toolbar.MenuItemSelected", @onToolbarItemSelected

	setToolbarAction: (action) ->	
		@toolbarAction = action
		@event_emitter.emit("toolbar-action-selected", action)
	emit: (event_name, event_parameters...) ->
		@event_emmitter.emit(event_name,event_parameters)

	onCanvasItemClick: (item_type, item) =>
		console.log "#{item_type} clicked"
		@collageItemClick(item)

	onToolbarItemSelected: (command) =>
		@collageItemClick = App.Commands[command].action

App.Commands = {


}
App.Commands.Resize =  


	action: (collage_item) ->

		console.log("making image resizable")
		canvas_group = collage_item.group
		{tl,tr,bl,br} = collage_item.corners
		canvas_item = collage_item.item
		
		item_position = canvas_item.getPosition();
		
		tl.on "dragmove",() =>
			tr.attrs.y = tl.attrs.y;
			bl.attrs.x = tl.attrs.x;
			
			img_width = tr.attrs.x - tl.attrs.x
			img_height = bl.attrs.y - tl.attrs.y
			canvas_item.setPosition(tl.attrs.x+6, tl.attrs.y+6)
			canvas_item.setSize(img_width,img_height);
		
		bl.on "dragmove",() =>
			tl.attrs.x = bl.attrs.x;
			br.attrs.y = bl.attrs.y;
			img_width = tr.attrs.x - tl.attrs.x;
			img_height = bl.attrs.y - tl.attrs.y;
			canvas_item.setPosition(tl.attrs.x+6, tl.attrs.y+6);
			canvas_item.setSize(img_width,img_height);
		
		tr.on "dragmove",() =>
			tl.attrs.y = tr.attrs.y;
			br.attrs.x = tr.attrs.x;
			img_width = tr.attrs.x - tl.attrs.x;	
			img_height = bl.attrs.y - tl.attrs.y;
			canvas_item.setPosition(tl.attrs.x+6, tl.attrs.y+6);
			canvas_item.setSize(img_width,img_height)
		
		br.on "dragmove",() =>
			bl.attrs.y = br.attrs.y
			tr.attrs.x = br.attrs.x
			img_width = tr.attrs.x - tl.attrs.x
			img_height = bl.attrs.y - tl.attrs.y
			canvas_item.setPosition(tl.attrs.x+6, tl.attrs.y+6)
			canvas_item.setSize(img_width,img_height)		

		_.each [tl,tr,br,bl],(corner) ->
			corner.show()
			corner.on "mousedown",() =>
				console.log("tl mousedown")
				canvas_group.setDraggable(false);
				canvas_group.moveToTop();
			
			corner.on "dragend", =>
				canvas_group.setDraggable(true)
		canvas_item.getLayer().draw()


				
		 

App.Commands.Rotate =
	action : (collage_item) ->

		console.log("rotating")
		canvas_group = collage_item.group
		canvas_item = collage_item.item
		corners = (collage_item.corners[c] for c of collage_item.corners)
		image_center = 
			x: canvas_item.attrs.x + (canvas_item.attrs.width / 2)
			y: canvas_item.attrs.y + (canvas_item.attrs.height / 2)
		center_vector = Vector.create([image_center.x,image_center.y])

		console.log(image_center)
		drag_start_position = {x:0,y:0}
		_.each corners, (c)->
			c.show()
			c.on "dragstart", ->
				canvas_group.setDraggable false
				drag_start_position.x = c.attrs.x
				drag_start_position.y = c.attrs.y

			c.on "dragend", ->
				canvas_group.setDraggable true

			c.on "dragmove", (evt)->
				console.log(this)
				console.log "drag start #{drag_start_position.x}, #{drag_start_position.y}"
				start_vector = Vector.create([drag_start_position.x,drag_start_position.y])
				current_vector = Vector.create([this.attrs.x,this.attrs.y])
				theta = current_vector.angleFrom(start_vector);
				console.log("theta: #{theta * 360/Math.PI}")
				canvas_group.rotate(theta)

		canvas_item.getLayer().draw()



App.RotateSlider = class RotateSlider
	constructor: (@container, @event_emmitter) ->
		@slide_element = $('<div id="rotate-slider" class="slider">').slider({
				min:-180
				max:180
				slide: @onSlide
			})
		@rotate_value_element = $('<span id="#rotate-value">').text('0');

		$("##{@container}").append(@slide_element).append(@rotate_value_element)
	onSlide: (evt,ui) =>

		console.log("slide")
		
	
		@rotate_value_element.text(ui.value) 
		@event_emmitter.emit("rotation.changed",ui.value)







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
		@event_emitter.on "rotation.changed", (value) =>
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
	

	




App.Photo = class Photo 

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
				app.event_emitter.emit("ItemSelected","Image",@)

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
		
		




App.ToolBar = class ToolBar
	constructor: (items_class_selector) ->
		toolbar_items = $(items_class_selector)
		@set_initial_active()
		@toolbar_items.click (evt,ui) =>

			command_name = $(evt.currentTarget).data 'action'
			console.log("#command clicked: #{command_name}")

			@set_active($(evt.currentTarget))
			app.event_emitter.emit 'Toolbar.MenuItemSelected', command_name


	set_active: (toolbar_item) ->
 		toolbar_item.addClass('active')
 		if @active?
 			@active.removeClass('active')
 		@active = toolbar_item

	set_initial_active: ->
		active_item =  $(i) for i in @toolbar_items when $(i).hasClass('active')
		active_item ?= @toolbar_items[0]
		@set_active(active_item)

		






$ ->
	window.emitter = new EventEmitter2()
	window.app = new App('canvas-container',emitter)
	collage_toolbar = new App.ToolBar('#collage-menu-list .menu-item')
	$('#login').click(facebookLogin)  
	$('#logout').click(() -> FB.logout())
	$('#canvas-container canvas')
		.droppable({drop:fb_photo_dropped})
		.css({border:'solid black 1px'})
	rotateSlider = new RotateSlider('sub-menu',window.emitter)	
		
        
fb_photo_dropped = (evt,ui) ->
	console.log("photo image dropped")
	console.dir(evt)
	console.dir(ui)
	img = $(ui.draggable)
	img_data =
	  offsetX:  evt.offsetX
	  offsetY: evt.offsetY
	  fbData: img.data('fb_data')
	console.log(img_data)
	app.collage.addFbPhoto(img_data)

