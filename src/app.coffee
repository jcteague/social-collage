
class App
	constructor: (@canvas_element, @event_emitter) ->
		@collage = new App.Collage(@canvas_element, @event_emitter)
		@collageItemClick = App.Commands.resize
		event_emitter.on "ItemClicked", @onCanvasItemClick
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
		console.log(command)