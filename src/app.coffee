define ['EventEmitter','Collage','ResizeCommand'],(event_emitter,Collage,resize) ->
	class App
		constructor: (@canvas_element) ->
			@collage = new Collage(@canvas_element)
			@collageItemClick = resize.action
			event_emitter.on "ItemSelected", @onCanvasItemClick
			event_emitter.on "Toolbar.MenuItemSelected", @onToolbarItemSelected

		setToolbarAction: (action) ->	
			@toolbarAction = action
			@event_emitter.emit("toolbar-action-selected", action)
		emit: (event_name, event_parameters...) ->
			@event_emmitter.emit(event_name,event_parameters)	

		onCanvasItemClick: (item_type, item) =>
			console.log "oncanvas click event #{item_type} item type"
			@collageItemClick(item)

		onToolbarItemSelected: (command) =>
			#@collageItemClick = App.Commands[command].action