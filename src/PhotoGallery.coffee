define ['jqueryUI','underscore','UserPhotos'], ($,_,UserPhotos) ->
	userPhotos = new UserPhotos()
	$ ->
		$('.photo-source').click(()->
			
			source = $(this).data('source')
			content_el = $("##{source}-photo-content")

			content_el.toggle('slide',{easing:'easeOutQuint',direction:'down'},1000)
		)
		$('.photo-submenu a').click ()->
			el = $(this)
			list = $($(this).parents('ul')[0])
			active_menu = list.find('.active')
			current_pics = $('#your-pics')
			content_source = list.data('contentsource')
			photo_source = $(this).data('photosource')
			userPhotos.loadPhotoCollection content_source,photo_source, (result) ->
				current_pics.empty()
				_.each result, (datum) ->
					li = $("<li class='span2 album'>")
					li.data('albumid',datum.id)
					content_el = $("<img src='#{datum.cover_photo_url}' class='picture thumbnail'>")
					li.append content_el
					current_pics.append(li)
					active_menu.removeClass('active')
					el.addClass('active')
			return
	
	return

