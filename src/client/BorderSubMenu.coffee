define ['jquery','EventEmitter','SubMenu'], ($,event_emitter, SubMenu) ->
		class BorderSubMenu extends SubMenu
			constructor: ()->
				super '#border-submenu'
				@border_size = $('#border-size')
				@border_color = $('#border-color-picker').colorpicker()
				
				@border_size.on "blur", (evt) =>
					console.log  "size blur"
					size = $(evt.currentTarget).val()
					console.log size
					event_emitter.emit "submenu.border.widthSet", {borderSize:size}
				@border_color.on "changeColor", (ev) =>
					console.log "border color change"
					event_emitter.emit "submenu.border.colorSet", {color:ev.color.toRGB()}

				$('#border-apply').on 'click',(evt) =>
					evt.preventDefault()
					event_emitter.emit "submenu.apply.border"

				$('#border-cancel').on 'click',(evt) =>
					evt.preventDefault()
					event_emitter.emit "submenu.cancel.border"

			setBorderWidth: (width) =>
				console.log "border width #{width}"
				@border_size.val(width)

			setBorderColor: (color) =>
				console.log "border color #{color}"