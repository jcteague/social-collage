define ['jqueryUI','underscore','EventEmitter'], ($,_,event_emitter)->
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

		get_facebook_collection_photos: (source, id, cb) ->
			FB.api "/#{id}/photos", (result) ->
					console.log result
					cb result
		
		load_fb_photo_collection: (source, cb) ->
			if source == 'me'
				@load_fb_user_photos cb
			if(source == 'albums')
				@load_fb_albums cb

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
			
			FB.api '/me/albums?fields=id,name,cover_photo', (albums) =>
				album_data = _.map albums.data, (alb) ->
					{
						id: alb.id
						name: alb.name
					}
									
				for i in [0..album_data.length-1]
					k = 0
					FB.api "/#{albums.data[i].cover_photo}", (cover_response) =>
						album_data[k].cover_url =  cover_response.picture		
						
						if(k == album_data.length-1)
							cb {"collection":album_data}
							return
						k++
						return
				return
			return

		fb_init: ->
			
			fbLogin = @fbLogin
			window.fbAsyncInit  = ->
					FB.init(
						appId      : '236634053108854', # App ID
						channelUrl : '//localhost/channel.html', # Channel File
						status     : true, # check login status
						cookie     : true, # enable cookies to allow the server to access the session
						xfbml      : true  # parse XFBML
					)
					FB.getLoginStatus((response)->
						if response.status is 'connected'
							console.log("facebook connected")
							event_emitter.emit('facebook:connected')
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
	
		

	 
