define ['jquery','underscore','EventEmitter','commands','CropSubMenu','ToolbarItem'],($,_,event_emitter,commands,CropSubMenu,ToolbarItem) ->
	class ToolBar extends Module
		constructor: (toolbar, default_command) ->
			@toolbar = $(toolbar)
			@menu_items = {}
			@toolbar.find('li').each (idx, item) =>
				li = $(item)
				command_name = li.data "commandname"
				menu_item = new ToolbarItem(@,command_name)
				@menu_items[command_name] = menu_item

			@toolbar_items = @toolbar.find('li')
			
			event_emitter.on "ItemSelected", (selected_item) => 
				@selected_canvas_item = selected_item
			
			event_emitter.on "ItemDeSelected", () => 
				console.log "toolbar ItemDelected:"
				@current_command?.unbind @selected_canvas_item
				return
			@toolbar_items.find('a').click @on_toolbar_item_click

		hide_menu: () ->
			@toolbar.find('a').hide()
		show_menu: () ->
			@toolbar.find('a').show()
		on_toolbar_item_click: (evt, ui) =>
			menu_item = $(evt.currentTarget).parent()
			command_name = menu_item.data 'commandname'
			console.log "selected action: #{command_name}"
			previous_menu_item = @current_menu_item
			@current_menu_item = @menu_items[command_name]

			# if @current_menu_item == previous_menu_item
			# 	return
			
			# previous_menu_item?.deactivate(@selected_canvas_item)
			@current_menu_item.activate(@selected_canvas_item)

			# sub_menu = menu_item.next('.submenu')
			# if(sub_menu)
			# 	@toolbar_items.hide()
			# 	commands[command_name].submenu.initialize menu_item,() =>
			# 		@current_command.unbind(@selected_canvas_item)
			# 		sub_menu.hide()
			# 		@toolbar_items.show()

			# 	sub_menu.show()


			
			

				
		set_initial_active: ->
			active_item =  $(i) for i in @toolbar_items when $(i).hasClass('active')
			active_item ?= @toolbar_items[0]
			@set_active(active_item)

		applyCommand: (item) =>
			# @selected_canvas_item = item
			# console.log "canvas item selected toolbar handler"
			
			# @current_command.bind_to item
			# # @selected_command.bind_to(item)





