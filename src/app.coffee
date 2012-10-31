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