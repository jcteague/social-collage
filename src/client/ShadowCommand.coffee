define ["fabric","EventEmitter"], (fabric, event_emitter) ->
	class ShadowCommand
		constructor: (@on_deactivate) ->

		activate: (@collage_item) ->
			stage = @collage_item.stage
			item = @collage_item.item
			shadow = 
				color: "rgba(0,0,0,0.5)"
				offsetX: 10
				offsetY: 10
				blur: 20
				affectStroke:true
			if @has_shadow(item)
				item.setShadow(null)
			else
				item.setShadow(shadow)
			stage.renderAll()
		has_shadow: (item) ->
			shadow = item.shadow
			if shadow == null
				return false
			if shadow.color == 'rgb(0,0,0)'
				return false
			return true


		deactivate: (@collage_item) ->
			# @on_deactivate()
