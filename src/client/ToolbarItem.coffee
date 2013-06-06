define ['require', 'jquery','EventEmitter'], (require, $,event_emitter) ->
	class ToolbarItem
		constructor: (@toolbar) ->
			
		show_submenu: () =>
			if @submenu
				@toolbar.hide_menu()
				@submenu.show()
		hide_submenu: () =>
			if @submenu
				@submenu.hide()
				@toolbar.show_menu()
		activate: (canvas_item) ->
			@show_submenu()
			@command.activate canvas_item, () =>
				@hide_submenu()

		deactivate: (canvas_item) ->
			@hide_submenu()
			@command.deactivate()
			