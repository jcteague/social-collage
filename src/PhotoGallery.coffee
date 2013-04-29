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
			collection_template = _.template """
				<li class='span2 album'>
					<a class="photo-collection-link" 
						href=# 
						data-collectionid="<%=id%>" 
						data-contentsource="<%=contentsource%>"
						data-photosource="<%=photosource%>"
						>
						<img src="<%= cover_photo_url%>" class='picture thumbnail' />
						<span class="photo-collection-label"><%=name%></span>
					</a>
				</li>"""

			userPhotos.loadPhotoCollection content_source,photo_source, (result) ->
				current_pics.empty()
				_.each result, (datum) ->
					template_data = 
						id:datum.id,
						name:datum.name,
						cover_photo_url: datum.cover_photo_url,
						"contentsource":content_source
						"photosource": photo_source
					current_pics.append(collection_template(template_data))
					active_menu.removeClass('active')
					el.addClass('active')
			return
		$('body').on 'click', '.photo-collection-link', (ev) ->
			el = $(this)
			pics = $('#your-pics')
			content_souce = el.data('contentsource')
			photo_source = el.data('photosource')
			collection_id = el.data('collectionid')
			userPhotos.getCollectionPhotos content_souce, photo_source, collection_id,(photo_data)->
				pics.empty()
				_.each photo_data.data, (item) ->
					img_el = $("<li class='span2'><img src='#{item.picture}' class='picture thumbnail'></li>")
					img_el.draggable({cursor:'move',cursorAt:{top:0,left:0},revert:'invalid',helper:'clone'})
					img_el.data('img_data',item)
					pics.append(img_el);  
				
	
	return

