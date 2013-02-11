define ['EventEmitter','Collage','Toolbar','Commands'],(event_emitter,Collage,Toolbar, commands) ->
	class App
		constructor: (@canvas_element) ->
			@collage = new Collage(@canvas_element)
			@toolbar = new Toolbar('#collage-menu-list .menu-item')
			@selected_command = commands.resize
			event_emitter.on "ItemSelected", @onCanvasItemSelected
			event_emitter.on "Toolbar.MenuItemSelected", @onToolbarItemSelected

		setToolbarAction: (action) ->	
			@toolbarAction = action
			@event_emitter.emit("toolbar-action-selected", action)
		

		onCanvasItemSelected: (item_type, item) =>
			console.log "oncanvas click event #{item_type} item type"
			@selected_command.bind_to(item)

		onToolbarItemSelected: (command) =>
			console.log("Toobar Item command: #{command}")
			@selected_command = commands[command]
			if @collage.currentItem?
				@selected_command.bind_to(@collage.currentItem)
	
	# class App
	# 	constructor: (@canvas_element) ->
	# 		@event_emmitter.on "Toolbar.MenuItemSelected", (command_name) ->
	# 			@onClickHandler = commands[command_name].action