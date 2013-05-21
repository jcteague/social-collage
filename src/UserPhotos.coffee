define ['jqueryUI','underscore','EventEmitter','async'], ($,_,event_emitter, async)->
	class UserPhotos
		class Pager
			constructor: (@context,@page_func) ->
			nextResult: (page_cb) ->
				@page_func @context, page_cb

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
			
			collection_url = "/#{id}/photos?limit=5"
			FB.api collection_url, (result) =>
					console.log result
					output = 
						data: result.data
					if result.paging
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


		get_fb_next_results: (collection_url, cb) ->
			console.log collection_url
			FB.api collection_url, (result) ->
				console.log "paging result"
				console.log result
				output = 
						data: result.data
				if result.paging?.next
					output.getNext = (cb) =>
						@get_fb_next_results(result.paging.next, cb)
				cb output
		
		load_fb_friends: (context, cb) =>
			console.log "loading friends"
			FB.api context.url , (friends) => 
				console.log "friends"
				friend_collection = _.map friends.data, (f) -> {id:f.id,name:f.name,cover_url: f.picture.data.url}
				
				output = 
					collection: friend_collection
				if friends.paging?.next
					output.pager = new Pager({url:friends.paging.next},@load_fb_friends)
					
				cb output

		load_fb_friend_collection: (cb) ->
				url = '/me/friends?limit=20&fields=id,name,picture'
				@load_fb_friends {url:url}, cb

		load_user_photos: (context, cb) =>
			console.log "getting user photos"
			FB.api context.url, (response) =>
				user_images =  _.map response.data, (img) -> {id: img.id, photo_url: img.picture,images: img.images}
				
				result =
					images:user_images
				
				if response.paging?.next
					result.pager = new Pager({url:response.paging.next},@load_user_photos)
				cb result

		load_fb_user_photos: (cb) ->
			console.log "load fb_user"
			url = '/me/photos?limit=5'
			@load_user_photos {url:url}, cb
			

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


	
		

	 
