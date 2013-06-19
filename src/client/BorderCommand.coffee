define ['fabric', 'EventEmitter'], (fabric,event_emitter) ->
	class BorderCommand
		constructor: (@menu, @on_applied, @on_deactivate) ->

		set_border: (border) =>

				if(border.size? >0)
					strokeWidth = parseInt border.size
				else
					strokeWidth = false
				strokeColor = @format_rgba_string(border.color)
				# strokeColor = "rgba('0,0,0,1)"
				console.log "setting border: #{strokeWidth}, #{strokeColor}"
				@canvas_item.item.set "strokeWidth", strokeWidth
				@canvas_item.item.set "stroke",  strokeColor

		activate: (@canvas_item) ->
			f_item = @canvas_item.item
			@original_border = {strokWidth: f_item.get 'strokeWidth', f_item.get 'stroke'}
			@menu.setBorderWidth(f_item.get 'strokeWidth')
			@menu.setBorderColor(f_item.get 'stroke')
	
			event_emitter.on "submenu.border.widthSet", (evt) =>
				console.log "border stroke"
				console.log evt
				@set_border(evt)
				
			
			event_emitter.on "submenu.border.colorSet", (evt) => 
				console.log "border color"
				console.log evt
				@set_border(evt)

			
			event_emitter.on 'submenu.apply.border', (border) =>
				console.log "apply border"
				console.log border
				@set_border(border)
				@on_applied()

			event_emitter.on 'submenu.cancel.border', () =>
				@deactivate()

		format_rgba_string: (color) ->
			"rgba(#{color.r},#{color.g},#{color.b},#{color.a})"

		deactivate: () ->
			@remove_border()
			@on_deactivate()

		remove_border: ()=>
			@canvas_item.item.set @original_border
			@canvas_item.stage.renderAll()

