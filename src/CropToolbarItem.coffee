define "ToolbarItem-crop", ["ToolbarItem","CropCommand","CropSubMenu"],(ToolbarItem, CropCommand, CropSubMenu) ->
	class CropToolbarItem extends ToolbarItem
		constructor: (@toolbar) ->
			super @toolbar
			@command = new CropCommand(@hide_submenu, @hide_submenu)
			@submenu = new CropSubMenu()

