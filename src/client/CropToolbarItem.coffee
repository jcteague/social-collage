define "ToolbarItem-crop", ["ToolbarItem","CropCommand","CropSubMenu"],(ToolbarItem, CropCommand, CropSubMenu) ->
	class CropToolbarItem extends ToolbarItem
		constructor: (@toolbar) ->
			super @toolbar
			@submenu = new CropSubMenu()
			@command = new CropCommand(@hide_submenu, @hide_submenu)
			

