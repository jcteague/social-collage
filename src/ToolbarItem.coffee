define ['require', 'jquery','EventEmitter'], (require, $,event_emitter) ->
	class ToolbarItem
		constructor: (@toolbar,@command_name) ->
			require [@command_name+"-submenu"], (SubMenu) =>
				@submenu = new SubMenu()
				

			require [@command_name+"-command"], (Cmd) =>
				@command = new Cmd(() => 
					@hide_submenu()
				,() => 
					@hide_submenu())
		show_submenu: () ->
			@toolbar.hide_menu()
			@submenu.show()
		hide_submenu: () ->
			@submenu.hide()
			@toolbar.show_menu()
		activate: (canvas_item) ->
			@show_submenu()
			@command.activate canvas_item, () =>
				@hide_submenu()

		deactivate: (canvas_item) ->
			@hide_submenu()
			@command.deactivate()
			