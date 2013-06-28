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
			@image_pager_btn.hide();
			@content_source = 'facebook'
			@image_collection_sub_menu = $('#collection-sub-menu')
			@wire_events()
			
		wire_events: ->
			event_emitter.on 'facebook.connected', ()=> @getPhotoCollection('me')
			event_emitter.on "loading.photoCollection.started", (evt) =>
				if @image_list.is(':visible')
					@image_list.hide()
					@image_list.parent().append '''<div id="loader" class="">
							<i class="icon-spinner icon-spin icon-large"></i>
							Loading ...
							</div>'''
				
			event_emitter.on "loading.photoCollection.completed", (evt) =>
				$('#loader').remove()
				@image_list.show()

			$('.photo-submenu a').click @handlePhotoMenuClick
			$('body').on 'click', '.photo-collection', @handlePhotoCollectionClick
			
			

		
		getPhotoCollection: (photo_source) ->
			console.log 'getting photo collection: #{photo_source}'
			# event_emitter.emit "loading.photoCollection.started"
			@userPhotos.loadPhotoCollection @content_source, photo_source, (result) =>
				console.log "load photo collection"
				console.log result
				# @current_collection = result
				@image_collection_title.text(result.title)
				if result.images
					@showImages result
				else
					@showImageCollection photo_source, result
				# event_emitter.emit "loading.photoCollection.completed"

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
					<div id='<%=id%>' style="background-image:url('<%= photo_url %>')" class='img-placeholder picture thumbnail'></div>
					<div class="photo-collection-label"></div>
					<!--<img src='<%= photo_url%>' id='<%=id%>' class='picture thumbnail' /> -->
				</li>"""
			_.each images.images, (item) =>
				img_el = $(image_element_template(item))
				img_el.draggable({cursor:'move',cursorAt:{top:0,left:0},revert:'invalid',helper:'clone'})
				img_el.data('img_data',item)
				@image_list.append(img_el);

			
			if(images.pager)
				@image_pager_btn.show().unbind().on "click", =>
					images.pager.nextResult @append_images
			else
				@image_pager_btn.hide()

		showImageCollection: (photo_source, data) =>
			console.log "show image collection"
			collection_template = _.template """
					<li class=' album'>
						<div style="background-image:url('<%= cover_url%>')" 
						  id='<%= id %>'
							class='img-placeholder picture thumbnail photo-collection' 
							data-collectionid="<%=id%>"
							data-collectionname="<%=name%>"
							
							data-photosource="<%=photosource%>"></div>
							<div class="photo-collection-label"><%=name%></div>
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

				if(photos.pager)
					@image_pager_btn.show().unbind().on "click", ->
						photos.pager.nextResult append_photos
				else
					@image_pager_btn.hide()			
			
			@image_list.empty()
			append_photos data




	
	
	togglePhotoContent = (content_el) ->
		content_el.toggle('slide',{easing:'easeOutQuint',direction:'down'},1000)

	