define "ToolbarItem-border", ["ToolbarItem","BorderCommand","BorderSubMenu"],(ToolbarItem, BorderCommand, SubMenu) ->
	class RemoveToolbarItem extends ToolbarItem
		constructor: (@toolbar) ->
			super @toolbar
			@submenu = new SubMenu()
			@command = new BorderCommand(@submenu, @hide_submenu,@hide_submenu)
			


