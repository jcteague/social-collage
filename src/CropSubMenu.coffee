define "crop-submenu", ['jquery','EventEmitter'], ($,event_emitter) ->
		class CropSubMenu
		
			constructor: (top_menu, on_close)->
				$('#crop-submenu').on 'click','#crop-apply',(evt, ui) ->
					event_name = $(this).data('event')
					console.log "crop submenu #{event_name}"
					event_emitter.emit event_name
				$('#crop-submenu').on 'click','#crop-cancel',(evt, ui) ->
					event_name = $(this).data('event')
					console.log "crop submenu #{event_name}"
					event_emitter.emit event_name
					# on_close()
			show: () ->
				$('#crop-submenu').show()
			hide: () ->
				$('#crop-submenu').hide()
		


