define ['jquery','EventEmitter','SubMenu'], ($,event_emitter, SubMenu) ->
		class BorderSubMenu extends SubMenu
			constructor: ()->
				super '#border-submenu'
				@border_size = $('#border-size')
				@border_color = $('#border-color-picker').colorpicker()
				@color = {r:255,g:255,b:255,a:1}
				
				@border_size.on "blur", (evt) =>
					console.log  "size blur"
					@size = $(evt.currentTarget).val() ? 0
					event_emitter.emit "submenu.border.widthSet", {size:@size,color:@color}
				@border_color.on "changeColor", (ev) =>
					console.log "border color change"
					@color = ev.color.toRGB()
					event_emitter.emit "submenu.border.colorSet", {size:@size, color:@color}

				$('#border-apply').on 'click',(evt) =>
					evt.preventDefault()
					event_emitter.emit "submenu.apply.border",{size:@size,color:@color}

				$('#border-cancel').on 'click',(evt) =>
					evt.preventDefault()
					event_emitter.emit "submenu.cancel.border"

			setBorderWidth: (width) =>
				console.log "border width #{width}"
				@border_size.val(width)

			setBorderColor: (color) =>
				console.log "border color #{color}"