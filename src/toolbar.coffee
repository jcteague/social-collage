define ['jquery','underscore','EventEmitter','commands'],($,_,event_emitter,commands) ->
	class ToolBar
		constructor: (items_class_selector, default_command) ->
			@current_command = commands[default_command]
			@toolbar_items = $(items_class_selector)
			event_emitter.on "ItemSelected", @applyCommand


			@toolbar_items.click (evt,ui) =>
				menu_item = $(evt.currentTarget)
				command_name = menu_item.data 'action'
				console.log "selected action: #{command_name}"
				if @current_command?.commandName == command_name
					return
				
				
				if @selected_canvas_item
					@current_command.unbind @selected_canvas_item
				@current_command = commands[command_name]	
				@applyCommand @selected_canvas_item

	
				@set_active(menu_item)
				event_emitter.emit 'Toolbar.MenuItemSelected', command_name
				


		set_active: (toolbar_item) ->
			$(i).removeClass('active') for i in @toolbar_items when $(i).hasClass('active')
			toolbar_item.addClass('active')


		set_initial_active: ->
			active_item =  $(i) for i in @toolbar_items when $(i).hasClass('active')
			active_item ?= @toolbar_items[0]
			@set_active(active_item)

		applyCommand: (item) =>
			@selected_canvas_item = item
			console.log "canvas item selected toolbar handler"
			
			@current_command.bind_to item
			# @selected_command.bind_to(item)





