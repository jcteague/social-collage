define ["fabric","EventEmitter"], (fabric, event_emitter) ->
	class RemoveCommand
		constructor: (@on_applied, @on_deactivate) ->

		activate: (@collage_item) ->
			stage = @collage_item.stage
			stage.remove(collage_item.item)
			event_emitter.emit "ItemRemoved",@collage_item
			@on_applied()


		deactivate: (@collage_item) ->
			@on_deactivate()

