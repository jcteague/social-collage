define ['kinetic'], (Kinetic) ->
	bind_to: (collage_item) ->
		console.log "move command"
		collage_item.group.setDraggable(true)

	unbind: (collage_item) ->
		collage_item.group.setDraggable(false)
