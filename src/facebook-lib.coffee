
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
				initialize()
			else
				facebookLogin();
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

facebookLogin = () ->
	FB.login (response) ->
		if response.authResponse then
			#loadUser()
	 
initialize = (authResponse)->
	console.log("initializing photos")
	FB.api '/me/photos',(response)->
		pics = $('#your-pics')
		_.each response.data, (item) ->
			img_el = $("<img src=#{item.picture}' class='picture'>")
			img_el.draggable({cursor:'move',cursorAt:{top:0,left:0},revert:'invalid',helper:'clone'})
			img_el.data('fb_data',item)
			pics.append(img_el);  
