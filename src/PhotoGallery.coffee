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

	handlePhotoSourceClick = ()->
		$('.photo-source').click ()->
			source = $(this).data('source')
			content_el = $("##{source}-photo-content")
			content_el.toggle('slide',{easing:'easeOutQuint',direction:'down'},1000)

	handlePhotoCollectionClick = ()->
		$('body').on 'click', '.photo-collection', (ev) ->
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


	getPhotoCollection = (content_source, photo_source) ->
		userPhotos.loadPhotoCollection content_source,photo_source, (result) ->
			console.log "load photo collection"
			console.log result
			if result.images
				showImages content_source, photo_source, result.images
			else
				showImageCollection content_source, photo_source, result.collection
			

	showImages = (content_source, photo_source, images) ->
		console.log "showing images"
		console.log images
		pics = $('#your-pics')
		pics.empty()
		_.each images, (item) ->
			img_el = $("<li class='span2'><img src='#{item.photo_url}' class='picture thumbnail'></li>")
			img_el.draggable({cursor:'move',cursorAt:{top:0,left:0},revert:'invalid',helper:'clone'})
			img_el.data('img_data',item)
			pics.append(img_el);  

	showImageCollection = (content_source, photo_source, collection) ->
		console.log "show image collection"
		collection_template = _.template """
				<li class='span2 album'>
					<img src="<%= cover_url%>" 
						class='picture thumbnail photo-collection' 
						data-collectionid="<%=id%>" 
						data-contentsource="<%=contentsource%>"
						data-photosource="<%=photosource%>" />
						<span class="photo-collection-label"><%=name%></span>
					
				</li>"""
		current_pics = $('#your-pics')
		current_pics.empty()
		_.each collection, (datum) ->
			template_data = 
				id:datum.id,
				name:datum.name,
				cover_url: datum.cover_url,
				"contentsource":content_source
				"photosource": photo_source
			current_pics.append(collection_template(template_data))
			
		return


