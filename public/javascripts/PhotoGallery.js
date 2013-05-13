// Generated by CoffeeScript 1.4.0
(function() {

  define(['jqueryUI', 'underscore', 'UserPhotos', 'EventEmitter'], function($, _, UserPhotos, event_emitter) {
    var getPhotoCollection, handlePhotoCollectionClick, handlePhotoSourceClick, handlePhotoSubMenuClick, showImageCollection, showImages, togglePhotoContent, userPhotos;
    userPhotos = new UserPhotos();
    $(function() {
      event_emitter.on('facebook:connected', function() {
        return getPhotoCollection('facebook', 'me');
      });
      handlePhotoSourceClick();
      handlePhotoSubMenuClick();
      return handlePhotoCollectionClick();
    });
    handlePhotoSubMenuClick = function() {
      return $('.photo-submenu a').click(function() {
        var active_menu, content_source, current_pics, el, list, photo_source;
        el = $(this);
        list = $($(this).parents('ul')[0]);
        active_menu = list.find('.active');
        current_pics = $('#your-pics');
        content_source = list.data('contentsource');
        photo_source = $(this).data('photosource');
        getPhotoCollection(content_source, photo_source);
        active_menu.removeClass('active');
        return el.addClass('active');
      });
    };
    handlePhotoSourceClick = function() {
      return $('.photo-source').click(function() {
        var content_el, photo_menu, source, top_position;
        photo_menu = $('#photo-menu');
        source = $(this).data('source');
        content_el = $("#" + source + "-photo-content");
        top_position = photo_menu.position().top - content_el.height();
        console.log(top_position);
        content_el.css({
          top: top_position
        });
        return togglePhotoContent(content_el);
      });
    };
    togglePhotoContent = function(content_el) {
      return content_el.toggle('slide', {
        easing: 'easeOutQuint',
        direction: 'down'
      }, 1000);
    };
    handlePhotoCollectionClick = function() {
      return $('body').on('click', '.photo-collection', function(ev) {
        var collection_id, content_souce, el, photo_source, pics;
        el = $(this);
        pics = $('#your-pics');
        content_souce = el.data('contentsource');
        photo_source = el.data('photosource');
        collection_id = el.data('collectionid');
        return userPhotos.getCollectionPhotos(content_souce, photo_source, collection_id, function(photo_data) {
          pics.empty();
          return _.each(photo_data.data, function(item) {
            var img_el;
            img_el = $("<li class=''><img src='" + item.picture + "' id='" + id + "' class='picture thumbnail'></li>");
            img_el.draggable({
              cursor: 'move',
              cursorAt: {
                top: 0,
                left: 0
              },
              revert: 'invalid',
              helper: 'clone'
            });
            img_el.data('img_data', item);
            return pics.append(img_el);
          });
        });
      });
    };
    getPhotoCollection = function(content_source, photo_source) {
      return userPhotos.loadPhotoCollection(content_source, photo_source, function(result) {
        console.log("load photo collection");
        console.log(result);
        if (result.images) {
          return showImages(content_source, photo_source, result.images);
        } else {
          return showImageCollection(content_source, photo_source, result.collection);
        }
      });
    };
    showImages = function(content_source, photo_source, images) {
      var pics;
      console.log("showing images");
      console.log(images);
      pics = $('#your-pics');
      pics.empty();
      return _.each(images, function(item) {
        var img_el;
        img_el = $("<li class=''><img src='" + item.photo_url + "' id='" + item.id + "' class='picture thumbnail'></li>");
        img_el.draggable({
          cursor: 'move',
          cursorAt: {
            top: 0,
            left: 0
          },
          revert: 'invalid',
          helper: 'clone'
        });
        img_el.data('img_data', item);
        return pics.append(img_el);
      });
    };
    return showImageCollection = function(content_source, photo_source, collection) {
      var collection_template, current_pics;
      console.log("show image collection");
      collection_template = _.template("<li class=' album'>\n	<img src=\"<%= cover_url%>\" \n	  id='<%= id %>'\n		class='picture thumbnail photo-collection' \n		data-collectionid=\"<%=id%>\" \n		data-contentsource=\"<%=contentsource%>\"\n		data-photosource=\"<%=photosource%>\" />\n		<span class=\"photo-collection-label\"><%=name%></span>\n	\n</li>");
      current_pics = $('#your-pics');
      current_pics.empty();
      _.each(collection, function(datum) {
        var template_data, _ref;
        template_data = {
          id: datum.id,
          name: datum.name,
          cover_url: (_ref = datum.cover_url) != null ? _ref : '/images/placeholder.jpg',
          "contentsource": content_source,
          "photosource": photo_source
        };
        return current_pics.append(collection_template(template_data));
      });
    };
  });

}).call(this);
