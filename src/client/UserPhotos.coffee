define ['jqueryUI','underscore','EventEmitter','async'], ($,_,event_emitter, async)->
	class UserPhotos
		class PhotoCollection
			constructor: (@title, @photos, @submenu) ->

		class Pager
			constructor: (@context,@page_func) ->
			nextResult: (page_cb) ->
				@page_func @context, page_cb

		
		constructor: ->
			@fb_app_id = ''

			@fb_init()
			event_emitter.on 'ImageCreated', @publish_image

		publish_image: (opts) =>
			console.log opts
			post_data =
				imageContent: opts.imageData
				photoId: opts.photoId
			event_emitter.emit "loading.photo.save.started"
			$.post "/photo",post_data,(photo_data) =>
				event_emitter.emit "loading.photo.save.completed"
				console.log "posted photo to server"
				fd = 
					message: "collage created by broowd."
					url: photo_data.url
					access_token: @fb_accessToken
				console.log "uploading to facebook: #{fd.url}"
				event_emitter.emit "loading.photo.publish.started"
				FB.api '/me/photos','post',fd, (response) ->
					event_emitter.emit "loading.photo.publish.completed"
					console.log response
					return #facebook post
				return #save photo
			return #publish image
		




		fbLogin: ->
			FB.login (response) ->
				if response.authResponse then
					#loadUser()
		loadPhotoCollection: (content, source, cb) ->
			console.log "load collection: #{content}, #{source}"
			if(content == 'facebook')
				event_emitter.emit "loading.photoCollection.started"
				@load_fb_photo_collection source, (output) ->
					cb output
					event_emitter.emit "loading.photoCollection.completed"
				return
		
		getCollectionPhotos: (content, source, id, cb) ->
			if(content == 'facebook')
				event_emitter.emit "loading.photoCollection.started"
				@get_facebook_collection_photos source, id, (output) ->
					cb (output)
					event_emitter.emit "loading.photoCollection.completed"

		get_facebook_collection_photos: (source, id, cb) =>
			
			collection_url = "/#{id}/photos?limit=20"
			console.log "collection #{id}"
			FB.api collection_url, (result) =>
					console.log result
					output = @format_fb_image_response result
					if source == "friends"
						output.subCollections = [
							{
								title: "Albums", 
								ownerid: id,
								get: (collection_id, cb)=> @load_fb_albums({url:"/#{collection_id}/albums"}, cb) 
							}
						]
					console.log "collection owner id: #{output.ownerid}"
					cb output

		
		load_fb_photo_collection: (source, cb) ->
			if source == 'me'
				@load_fb_user_photos cb
			if(source == 'albums')
				@load_fb_albums {url:"/me/albums"}, cb
			if(source == 'friends')
				console.log "friends"
				@load_fb_friend_collection cb		


		get_fb_next_results: (context, cb) =>
			
			FB.api context.url, (result) =>
				console.log "paging result"
				console.log result
				output = 
						data: result.data
				if result.paging?.next
					output.pager = new Pager({url:result.paging.next}, @get_fb_next_results)
			
				cb output

		format_fb_image_response: (response) ->
			user_images =  _.map response.data, (img) -> {id: img.id, photo_url: img.picture,images: img.images}
				
			result =
				title: "Pictures of You"
				images:user_images
			
			if response.paging?.next
				result.pager = new Pager({url:response.paging.next},@load_user_photos)
			return result

		
		load_fb_friends: (context, cb) =>
			console.log "loading friends"
			FB.api context.url , (friends) => 
				console.log "friends"
				friend_collection = _.map friends.data, (f) -> {id:f.id,name:f.name,cover_url: f.picture.data.url}
				
				output = 
					title: "Friends"
					collection: friend_collection
					owner: @fb_user

				if friends.paging?.next
					output.pager = new Pager({url:friends.paging.next},@load_fb_friends)
					
				cb output

		load_fb_friend_collection: (cb) ->
				url = '/me/friends?limit=20&fields=id,name,picture'
				@load_fb_friends {url:url}, cb

		load_user_photos: (context, cb) =>
			console.log "getting user photos"
			FB.api context.url, (response) =>
				result = @format_fb_image_response response
				cb result

		load_fb_user_photos: (cb) ->
			console.log "load fb_user"
			url = '/me/photos?limit=5'
			@load_user_photos {url:url}, cb
			

		load_fb_albums: (context, cb) ->
			
			process_album = (album, callback) ->
				FB.api "/#{album.cover_photo}", (cover)->
					album =
						id: album.id
						name: album.name
						cover_url: cover.picture
						owner: album.from
					callback(null, album)
			album_url = "#{context.url}?fields=id,name,cover_photo,from"
			console.log album_url
			event_emitter.emit "loading.photoCollection.started"
			FB.api album_url, (albums) =>
				console.log albums
				async.map albums.data, process_album,(err,result) ->
					cb ({"collection":result, title:"Your Albums"})
					event_emitter.emit "loading.photoCollection.completed"



		fb_init: ->
			userPhotos = @
			fbLogin = @fbLogin
			window.fbAsyncInit  =->
					FB.init(
						appId      : '236634053108854', # App ID
						channelUrl : '//localhost/channel.html', # Channel File
						status     : true, # check login status
						cookie     : true, # enable cookies to allow the server to access the session
						xfbml      : true  # parse XFBML
					)
					FB.getLoginStatus((response) =>
						console.log response
						if response.status is 'connected'
							console.log("facebook connected")
							userPhotos.fb_accessToken = response.authResponse.accessToken
							userPhotos.fb_userid = response.authResponse.userID
							event_emitter.emit('facebook.connected')
							FB.api( '/me?fields=id,name,picture', (result) -> userPhotos.fb_user = result)
							async.series [
								FB.api( '/me?fields=id,name,picture', (result) -> userPhotos.fb_user = result),
								
								event_emitter.emit 'facebook.userloaded'

							]
						else
							fbLogin();
					)
			((d) ->
				id = 'facebook-jssdk'
				ref = d.getElementsByTagName('script')[0]
				if(d.getElementById(id))
					return
				js = d.createElement 'script'
				js.id = id
				js.async = true
				js.src = '//connect.facebook.net/en_US/all.js'
				ref.parentNode.insertBefore js, ref
			)(document)


	
		

	 
