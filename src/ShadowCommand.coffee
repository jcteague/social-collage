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
			item.setShadow(shadow)
			stage.renderAll()
			


		deactivate: (@collage_item) ->
			# @on_deactivate()
