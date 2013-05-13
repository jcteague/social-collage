define "ToolbarItem-remove", ["ToolbarItem","RemoveCommand","exports"],(ToolbarItem, RemoveCommand, exports) ->
	class RemoveToolbarItem extends ToolbarItem
		constructor: (@toolbar) ->
			super @toolbar
			@command = new RemoveCommand()


