define ['jquery','underscore','EventEmitter','CommandTypes'],($,_,event_emitter,commands) ->
	class ToolBar
		constructor: (items_class_selector, default_command) ->

			@current_command = default_command
			@toolbar_items = $(items_class_selector)
			event_emitter.on "ItemSelected", @onCanvasItemSelected


			@toolbar_items.click (evt,ui) =>

				command_name = $(evt.currentTarget).data 'action'
				if @current_command?.commandName == command_name
					return
				else
					@current_command = commands[command_name]	
	
				@set_active($(evt.currentTarget))
				event_emitter.emit 'Toolbar.MenuItemSelected', command_name
				


		set_active: (toolbar_item) ->
	 		toolbar_item.addClass('active')
	 		if @active?
	 			@active.removeClass('active')

	 		@active = toolbar_item

		set_initial_active: ->
			active_item =  $(i) for i in @toolbar_items when $(i).hasClass('active')
			active_item ?= @toolbar_items[0]
			@set_active(active_item)

		onCanvasItemSelected: (item_type, item) =>
			console.log "canvas item selected toolbar handler"
			
			@current_command.bind_to item
			# @selected_command.bind_to(item)




