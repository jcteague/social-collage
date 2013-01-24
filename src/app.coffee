define ['EventEmitter','Collage','Toolbar','Commands'],(event_emitter,Collage,Toolbar, commands) ->
	class App
		constructor: (@canvas_element) ->
			@collage = new Collage(@canvas_element)
			@toolbar = new Toolbar('#collage-menu-list .menu-item')
			@collageItemClick = commands.resize.action
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
			@collageItemClick = commands[command].action

	# class App
	# 	constructor: (@canvas_element) ->
	# 		@event_emmitter.on "Toolbar.MenuItemSelected", (command_name) ->
	# 			@onClickHandler = commands[command_name].action