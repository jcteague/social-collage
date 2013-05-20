define "ToolbarItem-shadow", ["ToolbarItem","ShadowCommand"],(ToolbarItem, RemoveCommand) ->
	class RemoveToolbarItem extends ToolbarItem
		constructor: (@toolbar) ->
			super @toolbar
			@command = new RemoveCommand()


