// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['jqueryUI', 'underscore', 'EventEmitter', 'async'], function($, _, event_emitter, async) {
    var UserPhotos;
    return UserPhotos = (function() {
      var Pager, PhotoCollection;

      PhotoCollection = (function() {

        function PhotoCollection(title, photos, submenu) {
          this.title = title;
          this.photos = photos;
          this.submenu = submenu;
        }

        return PhotoCollection;

      })();

      Pager = (function() {

        function Pager(context, page_func) {
          this.context = context;
          this.page_func = page_func;
        }

        Pager.prototype.nextResult = function(page_cb) {
          return this.page_func(this.context, page_cb);
        };

        return Pager;

      })();

      function UserPhotos() {
        this.load_user_photos = __bind(this.load_user_photos, this);

        this.load_fb_friends = __bind(this.load_fb_friends, this);

        this.get_fb_next_results = __bind(this.get_fb_next_results, this);

        this.get_facebook_collection_photos = __bind(this.get_facebook_collection_photos, this);

        this.fbLogin = __bind(this.fbLogin, this);

        this.save_image = __bind(this.save_image, this);
        this.fb_app_id = '';
        this.fb_init();
        event_emitter.on('ImageCreated', this.save_image);
        event_emitter.on('PhotoPublishClicked', this.publish_image);
      }

      UserPhotos.prototype.save_image = function(opts) {
        var post_data,
          _this = this;
        console.log(opts);
        post_data = {
          imageContent: opts.imageData,
          photoId: opts.photoId
        };
        event_emitter.emit("loading.photo.save.started");
        $.post("/photo", post_data, function(photo_data) {
          console.log(photo_data);
          event_emitter.emit("loading.photo.save.completed");
        });
      };

      UserPhotos.prototype.publish_image = function(photo_data) {
        var fd;
        fd = {
          message: photo_data.comments,
          url: photo_data.url,
          access_token: this.fb_accessToken
        };
        console.log("uploading to facebook: " + fd.url);
        console.log(fd);
        event_emitter.emit("loading.photo.publish.started");
        return FB.api('/me/photos', 'post', fd, function(response) {
          var publish_data;
          console.log(response);
          publish_data = {
            service: 'facebook',
            identifier: response.id
          };
          $.post("/collage/" + photo_data.id + "/publish", publish_data, function(res) {
            event_emitter.emit("loading.photo.publish.completed");
            return console.log("pusblished");
          });
        });
      };

      UserPhotos.prototype.fbLogin = function() {
        console.log("logging into facebook");
        return FB.login(this.on_fb_login, {
          scope: 'email,user_photos,friends_phothos,publish_stream,photo_upload'
        });
      };

      UserPhotos.prototype.on_fb_login = function(response) {
        console.log("facebook login");
        return console.log(response);
      };

      UserPhotos.prototype.loadPhotoCollection = function(content, source, cb) {
        console.log("load collection: " + content + ", " + source);
        if (content === 'facebook') {
          event_emitter.emit("loading.photoCollection.started");
          this.load_fb_photo_collection(source, function(output) {
            cb(output);
            return event_emitter.emit("loading.photoCollection.completed");
          });
        }
      };

      UserPhotos.prototype.getCollectionPhotos = function(content, source, id, cb) {
        if (content === 'facebook') {
          event_emitter.emit("loading.photoCollection.started");
          return this.get_facebook_collection_photos(source, id, function(output) {
            cb(output);
            return event_emitter.emit("loading.photoCollection.completed");
          });
        }
      };

      UserPhotos.prototype.get_facebook_collection_photos = function(source, id, cb) {
        var collection_url,
          _this = this;
        collection_url = "/" + id + "/photos?limit=20";
        console.log("collection " + id);
        return FB.api(collection_url, function(result) {
          var output;
          console.log(result);
          output = _this.format_fb_image_response(result);
          if (source === "friends") {
            output.subCollections = [
              {
                title: "Albums",
                ownerid: id,
                get: function(collection_id, cb) {
                  return _this.load_fb_albums({
                    url: "/" + collection_id + "/albums"
                  }, cb);
                }
              }
            ];
          }
          console.log("collection owner id: " + output.ownerid);
          return cb(output);
        });
      };

      UserPhotos.prototype.load_fb_photo_collection = function(source, cb) {
        if (source === 'me') {
          this.load_fb_user_photos(cb);
        }
        if (source === 'albums') {
          this.load_fb_albums({
            url: "/me/albums"
          }, cb);
        }
        if (source === 'friends') {
          console.log("friends");
          return this.load_fb_friend_collection(cb);
        }
      };

      UserPhotos.prototype.get_fb_next_results = function(context, cb) {
        var _this = this;
        return FB.api(context.url, function(result) {
          var output, _ref;
          console.log("paging result");
          console.log(result);
          output = {
            data: result.data
          };
          if ((_ref = result.paging) != null ? _ref.next : void 0) {
            output.pager = new Pager({
              url: result.paging.next
            }, _this.get_fb_next_results);
          }
          return cb(output);
        });
      };

      UserPhotos.prototype.format_fb_image_response = function(response) {
        var result, user_images, _ref;
        user_images = _.map(response.data, function(img) {
          return {
            id: img.id,
            photo_url: img.picture,
            images: img.images
          };
        });
        result = {
          title: "Pictures of You",
          images: user_images
        };
        if ((_ref = response.paging) != null ? _ref.next : void 0) {
          result.pager = new Pager({
            url: response.paging.next
          }, this.load_user_photos);
        }
        return result;
      };

      UserPhotos.prototype.load_fb_friends = function(context, cb) {
        var _this = this;
        console.log("loading friends");
        return FB.api(context.url, function(friends) {
          var friend_collection, output, _ref;
          console.log("friends");
          friend_collection = _.map(friends.data, function(f) {
            return {
              id: f.id,
              name: f.name,
              cover_url: f.picture.data.url
            };
          });
          output = {
            title: "Friends",
            collection: friend_collection,
            owner: _this.fb_user
          };
          if ((_ref = friends.paging) != null ? _ref.next : void 0) {
            output.pager = new Pager({
              url: friends.paging.next
            }, _this.load_fb_friends);
          }
          return cb(output);
        });
      };

      UserPhotos.prototype.load_fb_friend_collection = function(cb) {
        var url;
        url = '/me/friends?limit=20&fields=id,name,picture';
        return this.load_fb_friends({
          url: url
        }, cb);
      };

      UserPhotos.prototype.load_user_photos = function(context, cb) {
        var _this = this;
        console.log("getting user photos");
        return FB.api(context.url, function(response) {
          var result;
          result = _this.format_fb_image_response(response);
          return cb(result);
        });
      };

      UserPhotos.prototype.load_fb_user_photos = function(cb) {
        var url;
        console.log("load fb_user");
        url = '/me/photos?limit=5';
        return this.load_user_photos({
          url: url
        }, cb);
      };

      UserPhotos.prototype.load_fb_albums = function(context, cb) {
        var album_url, process_album,
          _this = this;
        process_album = function(album, callback) {
          return FB.api("/" + album.cover_photo, function(cover) {
            album = {
              id: album.id,
              name: album.name,
              cover_url: cover.picture,
              owner: album.from
            };
            return callback(null, album);
          });
        };
        album_url = "" + context.url + "?fields=id,name,cover_photo,from";
        console.log(album_url);
        event_emitter.emit("loading.photoCollection.started");
        return FB.api(album_url, function(albums) {
          console.log(albums);
          return async.map(albums.data, process_album, function(err, result) {
            cb({
              "collection": result,
              title: "Your Albums"
            });
            return event_emitter.emit("loading.photoCollection.completed");
          });
        });
      };

      UserPhotos.prototype.fb_init = function() {
        var fbLogin, userPhotos;
        userPhotos = this;
        fbLogin = this.fbLogin;
        window.fbAsyncInit = function() {
          var _this = this;
          FB.init({
            appId: '555942874451874',
            channelUrl: '//localhost:5000/channel.html',
            status: true,
            cookie: true,
            xfbml: true
          });
          return FB.getLoginStatus(function(response) {
            console.log(response);
            if (response.status === 'connected') {
              console.log("facebook connected");
              userPhotos.fb_accessToken = response.authResponse.accessToken;
              userPhotos.fb_userid = response.authResponse.userID;
              event_emitter.emit('facebook.connected');
              FB.api('/me?fields=id,name,picture', function(result) {
                return userPhotos.fb_user = result;
              });
              return async.series([
                FB.api('/me?fields=id,name,picture', function(result) {
                  return userPhotos.fb_user = result;
                }), event_emitter.emit('facebook.userloaded')
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
