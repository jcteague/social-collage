define ['jquery','EventEmitter','SubMenu'], ($,event_emitter,SubMenu) ->
		class CropSubMenu extends SubMenu
		
			constructor: (top_menu, on_close)->
				super '#crop-submenu'
				$('#crop-submenu').on 'click','#crop-apply',(evt, ui) ->
					event_name = $(this).data('event')
					console.log "crop submenu #{event_name}"
					event_emitter.emit event_name
				$('#crop-submenu').on 'click','#crop-cancel',(evt, ui) ->
					event_name = $(this).data('event')
					console.log "crop submenu #{event_name}"
					event_emitter.emit event_name
					# on_close()
			
		


