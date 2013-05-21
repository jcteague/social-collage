define ['jqueryUI','underscore','EventEmitter','async'], ($,_,event_emitter, async)->
	class UserPhotos	
		constructor: ->
			@fb_init()

		fbLogin: ->
			FB.login (response) ->
				if response.authResponse then
					#loadUser()
		loadPhotoCollection: (content, source, cb) ->
			console.log "load collection: #{content}, #{source}"
			if(content == 'facebook')
				@load_fb_photo_collection(source, cb)
				return
		
		getCollectionPhotos: (content, source, id, cb) ->
			if(content == 'facebook')
				@get_facebook_collection_photos source, id, cb

		get_facebook_collection_photos: (source, id, cb) =>
			
			collection_url = "/#{id}/photos"
			FB.api collection_url, (result) =>
					console.log result
					output = 
						data: result.data
					if result.paging
						output.getNext = (cb) =>
							@get_fb_next_results(result.paging.next, cb)
					cb output
		


		get_fb_next_results: (collection_url, cb) ->
			console.log collection_url
			FB.api collection_url, (result) ->
				console.log "paging result"
				console.log result
				output = 
						data: result.data
				if result.paging.next
					output.getNext = (cb) =>
						@get_fb_next_results(result.paging.next, cb)
				cb output
		load_fb_photo_collection: (source, cb) ->
			if source == 'me'
				@load_fb_user_photos cb
			if(source == 'albums')
				@load_fb_albums cb
			if(source == 'friends')
				console.log "friends"
				@load_fb_friend_collection cb		

		load_fb_friends: (url, cb) ->
			FB.api url , (friends) => 
				console.log "friends"
				friend_collection = _.map friends.data, (f) -> {id:f.id,name:f.name,cover_url: f.picture.data.url}
				
				output = 
					collection: friend_collection
				if friends.paging.next
					output.getNext = (page_cb) =>
						@load_fb_friends friends.paging.next, page_cb
				
				cb output

		load_fb_friend_collection: (cb) ->
				url = '/me/friends?limit=20&fields=id,name,picture'
				@load_fb_friends url, cb
				

			# 	FB.api "/#{friend.id}?fields=cover", (result)->
			# 		console.log "friend result"
			# 		console.log result
			# 		friend.cover_url = result.cover?.source
			# 		callback(null, friend)


			# async.map @fb_user.friends.data, get_fb_friend_cover_photo,(err,results)->cb {"collection":results}
		

		load_fb_user_photos: (cb) ->
			console.log "load fb_user"
			FB.api 'me/photos', (response) ->
			 user_images =  _.map response.data, (img)->
					{
						id: img.id
						photo_url: img.picture
						images: img.images
					}
					
				cb {images: user_images}

		load_fb_albums: (cb) ->
			
			process_album = (album, callback) ->
				FB.api "/#{album.cover_photo}", (cover)->
					album =
						id: album.id
						name: album.name
						cover_url: cover.picture
					callback(null, album)
			
			FB.api '/me/albums?fields=id,name,cover_photo', (albums) =>
				
				async.map albums.data, process_album,(err,result)->cb ({"collection":result})

			# 	album_data = _.map albums.data, (alb) ->
			# 		{
			# 			id: alb.id
			# 			name: alb.name
			# 		}
									
			# 	for i in [0..album_data.length-1]
			# 		k = 0
			# 		FB.api "/#{albums.data[i].cover_photo}", (cover_response) =>
			# 			album_data[k].cover_url =  cover_response.picture		
						
			# 			if(k == album_data.length-1)
			# 				cb {"collection":album_data}
			# 				return
			# 			k++
			# 			return
			# 	return
			# return

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
					FB.getLoginStatus((response) ->
						if response.status is 'connected'
							console.log("facebook connected")
							event_emitter.emit('facebook:connected')
							FB.api( '/me?fields=id,name,picture', (result) -> userPhotos.fb_user = result)
							async.series [
								FB.api( '/me?fields=id,name,picture', (result) -> userPhotos.fb_user = result),
								
								event_emitter.emit 'facebook:userloaded'

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


	
		

	 
