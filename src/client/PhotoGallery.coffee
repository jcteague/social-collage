define ['jqueryUI','underscore','UserPhotos','EventEmitter'], ($,_,UserPhotos,event_emitter) ->
	$ ->
		window.photoGallery = new PhotoGallery()

	class PhotoGallery
		constructor: ->
			@userPhotos = new UserPhotos()
			@facebook_menu = $('#facebook-menu')
			@image_list = $('#image-list')

			@image_collection_title = $('#collection-title')
			@image_pager_btn = $('#more-images')
			@content_source = 'facebook'
			@image_collection_sub_menu = $('#collection-sub-menu')
			@wire_events()
			
		wire_events: ->
			event_emitter.on 'facebook.connected', ()=> @getPhotoCollection('me')
			$('.photo-submenu a').click @handlePhotoMenuClick
			$('body').on 'click', '.photo-collection', @handlePhotoCollectionClick
			
			

		resize_thumbnails: ->
			@image_list.find('img').each (x,img) ->
				_img = $(img)
				max_width = _img.width();
				max_height = _img.height();
				_img.removeClass('thumbnail')
				ratio = 0;  #Used for aspect ratio
				width = _img.width();    # Current image width
				height = _img.height();  # Current image height

				# Check if the current width is larger than the max
				if(width > max_width)
					ratio = max_width / width;   # get ratio for scaling image
					$(this).css("width", max_width); # Set new width
					$(this).css("height", height * ratio);  # Scale height based on ratio
					height = height * ratio;    # Reset height to match scaled image
					width = width * ratio;    # Reset width to match scaled image


				# Check if current height is larger than max
				if(height > max_height)
					ratio = max_height / height; # get ratio for scaling image
					$(this).css("height", max_height);   # Set new height
					$(this).css("width", width * ratio);    # Scale width based on ratio
					width = width * ratio;    # Reset width to match scaled image
				_img.addClass 'thumbnail'
				console.log "#{_img.width()}, #{_img.height()}"
		
		getPhotoCollection: (photo_source) ->
			console.log 'getting photo collection: #{photo_source}'
			@userPhotos.loadPhotoCollection @content_source, photo_source, (result) =>
				console.log "load photo collection"
				console.log result
				# @current_collection = result
				@image_collection_title.text(result.title)
				if result.images
					@showImages result
				else
					@showImageCollection photo_source, result

		handlePhotoMenuClick: (ev) =>
			console.log "handle photo menu click"
			el = $(ev.currentTarget)
			list = $(el.parents('ul')[0])
			active_menu = list.find('.active')
			@content_source = list.data('contentsource')
			photo_source = $(el).data('photosource')
			@getPhotoCollection(photo_source)
			active_menu.removeClass('active')
			el.addClass('active')
			@active_menu = photo_source
			@image_collection_sub_menu.hide()

		handlePhotoCollectionClick: (ev) =>
			console.log "photo collection click"
			el = $(ev.currentTarget)
			
			# content_souce = el.data('contentsource')
			photo_source = el.data('photosource')
			collection_id = el.attr('data-collectionid')
			collection_name = el.attr('data-collectionname')
			collection_owner = el.attr('data-collectionowner')
			console.log "#{photo_source}, #{collection_id}, #{collection_name}, #{collection_owner}"
			
			# @set_current_collection_owner(photo_source, collection_id, collection_name)
			show_submenu = @requires_submenu(photo_source, collection_id)
			@image_collection_title.text(collection_name)
			@userPhotos.getCollectionPhotos @content_source, photo_source, collection_id,(photo_data) =>
				console.log photo_data
				@image_list.empty()
				@append_images(photo_data)
				if show_submenu

					@create_sub_collection_menu(photo_data.subCollections)
				else
					@image_collection_sub_menu.hide().empty()
		
		# set_current_collection_owner: (source, owner_id, owner_name) ->
		# 	@current_album_owner = 
		# 		id: owner_id
		# 		name: collection_name


		requires_submenu: (photo_source, collection_id) ->
			@active_menu == 'friends'



		create_sub_collection_menu: (submenus) =>
			if submenus
				@submenus = submenus


			console.log "sub menus"
			console.log @submenus
			
			@image_collection_sub_menu.empty()
			_.each @submenus, (item) =>
				list_item = $("<li><a href='#'>#{item.title}</a></li>")
				list_item.find("a")
					.data('ownerid', item.ownerid)
					.on "click", (evt) =>
						owner_id = $(evt.currentTarget).data("ownerid")
						item.get owner_id, (result) =>
							@showImageCollection "album", result
				@image_collection_sub_menu.append list_item
			@image_collection_sub_menu.show()
		

		showImages: (image_collection) =>
			console.log "showing images"
			@image_list.empty()
			@append_images image_collection


		append_images: (images) =>
			image_element_template = _.template """
				<li class=''>
					<img src='<%= photo_url%>' id='<%=id%>' class='picture thumbnail' />
				</li>"""
			_.each images.images, (item) =>
				img_el = $(image_element_template(item))
				img_el.draggable({cursor:'move',cursorAt:{top:0,left:0},revert:'invalid',helper:'clone'})
				img_el.data('img_data',item)
				@image_list.append(img_el);
				@resize_thumbnails()
			
			if(images.pager)
				@image_pager_btn.show().unbind().on "click", ->
					images.pager.nextResult @append_images
			else
				@image_pager_btn.hide()

		showImageCollection: (photo_source, data) =>
			console.log "show image collection"
			collection_template = _.template """
					<li class=' album'>
						<img src="<%= cover_url%>" 
						  id='<%= id %>'
							class='picture thumbnail photo-collection' 
							data-collectionid="<%=id%>"
							data-collectionname="<%=name%>"
							
							data-photosource="<%=photosource%>" />
							<span class="photo-collection-label"><%=name%></span>
					</li>"""
			
			append_photos = (photos) =>
				_.each photos.collection, (datum) =>
					template_data =

						id:datum.id,
						name:datum.name,
						cover_url: datum.cover_url ? '/images/placeholder.jpg',
						# "contentsource": @content_source,
						"photosource": photo_source,
						owner: JSON.stringify datum.owner
					@image_list.append(collection_template(template_data))
					@resize_thumbnails()
				if(photos.pager)
					@image_pager_btn.show().unbind().on "click", ->
						photos.pager.nextResult append_photos
				else
					@image_pager_btn.hide()			
			
			@image_list.empty()
			append_photos data




	
	
	togglePhotoContent = (content_el) ->
		content_el.toggle('slide',{easing:'easeOutQuint',direction:'down'},1000)

	