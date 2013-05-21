define ['jqueryUI','underscore','UserPhotos','EventEmitter'], ($,_,UserPhotos,event_emitter) ->
	userPhotos = new UserPhotos()
	$ ->
		event_emitter.on 'facebook:connected', ()-> getPhotoCollection('facebook','me')
		handlePhotoSourceClick()
		handlePhotoSubMenuClick()		
		handlePhotoCollectionClick()

	
	handlePhotoSubMenuClick = () ->
		$('.photo-submenu a').click () ->
			el = $(this)
			list = $($(this).parents('ul')[0])
			active_menu = list.find('.active')
			current_pics = $('#your-pics')
			content_source = list.data('contentsource')
			photo_source = $(this).data('photosource')
		
			getPhotoCollection(content_source,photo_source)
			active_menu.removeClass('active')
			el.addClass('active')

	getPhotoCollection = (content_source, photo_source) ->
		userPhotos.loadPhotoCollection content_source,photo_source, (result) ->
			console.log "load photo collection"
			console.log result
			if result.images
				showImages content_source, photo_source, result
			else
				showImageCollection content_source, photo_source, result
			


	handlePhotoSourceClick = ()->
		$('.photo-source').click ()->
			photo_menu = $('#photo-menu')
			source = $(this).data('source')
			content_el = $("##{source}-photo-content")
			top_position = photo_menu.position().top - content_el.height()
			console.log top_position
			content_el.css({top: top_position})
			togglePhotoContent(content_el)

	togglePhotoContent = (content_el) ->
		content_el.toggle('slide',{easing:'easeOutQuint',direction:'down'},1000)

	handlePhotoCollectionClick = ()->
		$('body').on 'click', '.photo-collection', (ev) ->
			el = $(this)
			pics = $('#your-pics')
			content_souce = el.data('contentsource')
			photo_source = el.data('photosource')
			collection_id = el.data('collectionid')
			append_images = (photos) ->
				_.each photos.data, (item) ->
					img_el = $("<li class=''><img src='#{item.picture}' class='picture thumbnail'></li>")
					img_el.draggable({cursor:'move',cursorAt:{top:0,left:0},revert:'invalid',helper:'clone'})
					img_el.data('img_data',item)
					pics.append(img_el);
				if(photos.pager)
					$('#more-images').show()
					$('#more-images').unbind('click')
					$('#more-images').on 'click', ->
						photos.pager.nextResult append_images
				else
					$('#more-images')

			userPhotos.getCollectionPhotos content_souce, photo_source, collection_id,(photo_data)->
				pics.empty()
				append_images(photo_data)
				
							

	showImages = (content_source, photo_source, images) ->
		console.log "showing images"
		console.log images
		pics = $('#your-pics')
		append_photos = (photos) ->
			_.each photos.images, (item) ->
				img_el = $("<li class=''><img src='#{item.photo_url}' id='#{item.id}' class='picture thumbnail'></li>")
				img_el.draggable({cursor:'move',cursorAt:{top:0,left:0},revert:'invalid',helper:'clone'})
				img_el.data('img_data',item)
				pics.append(img_el);  
			
			if(photos.pager)
				$('#more-images').show()
				$('#more-images').unbind('click')
				$('#more-images').on 'click', ->
					photos.pager.nextResult append_photos
			else
				$('#more-images').hide()
					
		pics.empty()
		append_photos images


	showImageCollection = (content_source, photo_source, data) ->
		console.log "show image collection"
		collection_template = _.template """
				<li class=' album'>
					<img src="<%= cover_url%>" 
					  id='<%= id %>'
						class='picture thumbnail photo-collection' 
						data-collectionid="<%=id%>" 
						data-contentsource="<%=contentsource%>"
						data-photosource="<%=photosource%>" />
						<span class="photo-collection-label"><%=name%></span>
					
				</li>"""
		
		append_photos = (photos) ->
			_.each photos.collection, (datum) ->
				template_data = 
					id:datum.id,
					name:datum.name,
					cover_url: datum.cover_url ? '/images/placeholder.jpg',
					"contentsource":content_source
					"photosource": photo_source
				current_pics.append(collection_template(template_data))
			if photos.pager
				$('#more-images').show()
				$('#more-images').unbind('click')
				$('#more-images').on "click", () ->
					photos.pager.nextResult append_photos

					
			else
				$('#more-images').hide()
		current_pics = $('#your-pics')
		current_pics.empty()
		append_photos data
	
		return


