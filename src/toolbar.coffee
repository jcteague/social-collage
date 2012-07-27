App.ToolBar = class ToolBar
	constructor: (items_class_selector) ->
		@toolbar_items = $(items_class_selector)
		@toolbar_items.click((evt,ui) ->
			command_name = $(@).data 'action'
			app.event_emitter.emit 'Toolbar.MenuItemSelected', App.Commands[command_name]
		)	

