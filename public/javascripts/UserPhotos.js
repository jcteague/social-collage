(function() {

  define(['jqueryUI', 'underscore'], function($, _) {
    var UserPhotos;
    return UserPhotos = (function() {

      function UserPhotos() {
        this.fb_init();
      }

      UserPhotos.prototype.fbLogin = function() {
        return FB.login(function(response) {
          if (response.authResponse) {}
        });
      };

      UserPhotos.prototype.show_fb_photos = function(authResponse) {
        console.log("initializing photos");
        return FB.api('/me/photos', function(response) {
          var pics;
          pics = $('#your-pics');
          return _.each(response.data, function(item) {
            var img_el;
            img_el = $("<img src=" + item.picture + "' class='picture'>");
            img_el.draggable({
              cursor: 'move',
              cursorAt: {
                top: 0,
                left: 0
              },
              revert: 'invalid',
              helper: 'clone'
            });
            img_el.data('fb_data', item);
            return pics.append(img_el);
          });
        });
      };

      UserPhotos.prototype.fb_init = function() {
        var fbLogin, show_photos;
        show_photos = this.show_fb_photos;
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
              return show_photos();
            } else {
              return fbLogin();
            }
          });
        };
        return (function(d) {
          var id, js, ref;
          id = 'facebook-jssdk';
          ref = d.getElementsByTagName('script')[0];
          if (d.getElementById(id)) return;
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
