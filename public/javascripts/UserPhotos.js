// Generated by CoffeeScript 1.4.0
(function() {

  define(['jqueryUI', 'underscore', 'EventEmitter', 'async'], function($, _, event_emitter, async) {
    var UserPhotos;
    return UserPhotos = (function() {

      function UserPhotos() {
        this.fb_init();
      }

      UserPhotos.prototype.fbLogin = function() {
        return FB.login(function(response) {
          if (response.authResponse) {

          }
        });
      };

      UserPhotos.prototype.loadPhotoCollection = function(content, source, cb) {
        console.log("load collection: " + content + ", " + source);
        if (content === 'facebook') {
          this.load_fb_photo_collection(source, cb);
        }
      };

      UserPhotos.prototype.getCollectionPhotos = function(content, source, id, cb) {
        if (content === 'facebook') {
          return this.get_facebook_collection_photos(source, id, cb);
        }
      };

      UserPhotos.prototype.get_facebook_collection_photos = function(source, id, cb) {
        return FB.api("/" + id + "/photos", function(result) {
          console.log(result);
          return cb(result);
        });
      };

      UserPhotos.prototype.load_fb_photo_collection = function(source, cb) {
        if (source === 'me') {
          this.load_fb_user_photos(cb);
        }
        if (source === 'albums') {
          this.load_fb_albums(cb);
        }
        if (source === 'friends') {
          console.log("friends");
          return this.load_fb_friend_collection(cb);
        }
      };

      UserPhotos.prototype.load_fb_friend_collection = function(cb) {
        var friend_collection;
        friend_collection = _.map(this.fb_user.friends.data, function(f) {
          return {
            id: f.id,
            name: f.name,
            cover_url: f.picture.data.url
          };
        });
        return cb({
          "collection": friend_collection
        });
      };

      UserPhotos.prototype.load_fb_user_photos = function(cb) {
        console.log("load fb_user");
        return FB.api('me/photos', function(response) {
          var user_images;
          user_images = _.map(response.data, function(img) {
            return {
              id: img.id,
              photo_url: img.picture,
              images: img.images
            };
          });
          return cb({
            images: user_images
          });
        });
      };

      UserPhotos.prototype.load_fb_albums = function(cb) {
        var process_album,
          _this = this;
        process_album = function(album, callback) {
          return FB.api("/" + album.cover_photo, function(cover) {
            album = {
              id: album.id,
              name: album.name,
              cover_url: cover.picture
            };
            return callback(null, album);
          });
        };
        return FB.api('/me/albums?fields=id,name,cover_photo', function(albums) {
          return async.map(albums.data, process_album, function(err, result) {
            return cb({
              "collection": result
            });
          });
        });
      };

      UserPhotos.prototype.fb_init = function() {
        var fbLogin, userPhotos;
        userPhotos = this;
        fbLogin = this.fbLogin;
        window.fbAsyncInit = function() {
          FB.init({
            appId: '236634053108854',
            channelUrl: '//localhost/channel.html',
            status: true,
            cookie: true,
            xfbml: true
          });
          return FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
              console.log("facebook connected");
              event_emitter.emit('facebook:connected');
              return async.series([
                FB.api('/me?fields=id,name,picture', function(result) {
                  return userPhotos.fb_user = result;
                }), FB.api('/me/friends?fields=id,name,picture', function(friends) {
                  return userPhotos.fb_user.friends = friends;
                }), event_emitter.emit('facebook:userloaded')
              ]);
            } else {
              return fbLogin();
            }
          });
        };
        return (function(d) {
          var id, js, ref;
          id = 'facebook-jssdk';
          ref = d.getElementsByTagName('script')[0];
          if (d.getElementById(id)) {
            return;
          }
          js = d.createElement('script');
          js.id = id;
          js.async = true;
          js.src = '//connect.facebook.net/en_US/all.js';
          return ref.parentNode.insertBefore(js, ref);
        })(document);
      };

      return UserPhotos;

    })();
  });

}).call(this);
