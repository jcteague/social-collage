define ['fabric', 'EventEmitter'], (fabric,event_emitter) ->
	class BorderCommand
		constructor: (@menu, @on_applied, @on_deactivate) ->

		activate: (@canvas_item) ->
			f_item = @canvas_item.item
			@original_border = {strokWidth: f_item.get 'strokeWidth', f_item.get 'stroke'}
			@menu.setBorderWidth(f_item.get 'strokeWidth')
			@menu.setBorderColor(f_item.get 'stroke')

			event_emitter.on "submenu.border.widthSet", (evt) =>
				@canvas_item.item.set "strokeWidth", evt.borderSize
				@canvas_item.stage.renderAll()
			
			event_emitter.on "submenu.border.colorSet", (evt) =>
				rgb = "rgba(#{evt.color.r},#{evt.color.g},#{evt.color.b},#{evt.color.a})"
				console.log rgb
				@canvas_item.item.set "stroke", rgb
				@canvas_item.stage.renderAll()
			event_emitter.on 'submenu.apply.border', () =>
				@on_applied()
			event_emitter.on 'submenu.cancel.border', () =>
				@deactivate()

		deactivate: () ->
			@remove_border()
			@on_deactivate()

		remove_border: ()=>
			@canvas_item.item.set @original_border
			@canvas_item.stage.renderAll()

