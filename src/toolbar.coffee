define ['jquery','EventEmitter'],($,event_emitter) ->
	class ToolBar
		constructor: (items_class_selector) ->

			@toolbar_items = $(items_class_selector)
			@set_initial_active()
			@toolbar_items.click (evt,ui) =>

				command_name = $(evt.currentTarget).data 'action'
				console.log("#command clicked: #{command_name}")

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

		



