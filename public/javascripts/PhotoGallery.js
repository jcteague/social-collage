(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['jqueryUI', 'underscore', 'UserPhotos', 'EventEmitter'], function($, _, UserPhotos, event_emitter) {
    var PhotoGallery, togglePhotoContent;
    $(function() {
      return window.photoGallery = new PhotoGallery();
    });
    PhotoGallery = (function() {
      function PhotoGallery() {
        this.showImageCollection = __bind(this.showImageCollection, this);
        this.append_images = __bind(this.append_images, this);
        this.showImages = __bind(this.showImages, this);
        this.create_sub_collection_menu = __bind(this.create_sub_collection_menu, this);
        this.handlePhotoCollectionClick = __bind(this.handlePhotoCollectionClick, this);
        this.handlePhotoMenuClick = __bind(this.handlePhotoMenuClick, this);
        this.userPhotos = new UserPhotos();
        this.facebook_menu = $('#facebook-menu');
        this.image_list = $('#image-list');
        this.image_collection_title = $('#collection-title');
        this.image_pager_btn = $('#more-images');
        this.content_source = 'facebook';
        this.image_collection_sub_menu = $('#collection-sub-menu');
        this.wire_events();
      }

      PhotoGallery.prototype.wire_events = function() {
        var _this = this;
        event_emitter.on('facebook:connected', function() {
          return _this.getPhotoCollection('me');
        });
        $('.photo-submenu a').click(this.handlePhotoMenuClick);
        return $('body').on('click', '.photo-collection', this.handlePhotoCollectionClick);
      };

      PhotoGallery.prototype.getPhotoCollection = function(photo_source) {
        var _this = this;
        return this.userPhotos.loadPhotoCollection(this.content_source, photo_source, function(result) {
          console.log("load photo collection");
          console.log(result);
          _this.image_collection_title.text(result.title);
          if (result.images) {
            return _this.showImages(result);
          } else {
            return _this.showImageCollection(photo_source, result);
          }
        });
      };

      PhotoGallery.prototype.handlePhotoMenuClick = function(ev) {
        var active_menu, el, list, photo_source;
        console.log("handle photo menu click");
        el = $(ev.currentTarget);
        list = $(el.parents('ul')[0]);
        active_menu = list.find('.active');
        this.content_source = list.data('contentsource');
        photo_source = $(el).data('photosource');
        this.getPhotoCollection(photo_source);
        active_menu.removeClass('active');
        el.addClass('active');
        this.active_menu = photo_source;
        return this.image_collection_sub_menu.hide();
      };

      PhotoGallery.prototype.handlePhotoCollectionClick = function(ev) {
        var collection_id, collection_name, collection_owner, el, photo_source, show_submenu,
          _this = this;
        console.log("photo collection click");
        el = $(ev.currentTarget);
        photo_source = el.data('photosource');
        collection_id = el.attr('data-collectionid');
        collection_name = el.attr('data-collectionname');
        collection_owner = el.attr('data-collectionowner');
        console.log("" + photo_source + ", " + collection_id + ", " + collection_name + ", " + collection_owner);
        show_submenu = this.requires_submenu(photo_source, collection_id);
        this.image_collection_title.text(collection_name);
        return this.userPhotos.getCollectionPhotos(this.content_source, photo_source, collection_id, function(photo_data) {
          console.log(photo_data);
          _this.image_list.empty();
          _this.append_images(photo_data);
          if (show_submenu) {
            return _this.create_sub_collection_menu(photo_data.subCollections);
          } else {
            return _this.image_collection_sub_menu.hide().empty();
          }
        });
      };

      PhotoGallery.prototype.requires_submenu = function(photo_source, collection_id) {
        return this.active_menu === 'friends';
      };

      PhotoGallery.prototype.create_sub_collection_menu = function(submenus) {
        var _this = this;
        if (submenus) {
          this.submenus = submenus;
        }
        console.log("sub menus");
        console.log(this.submenus);
        this.image_collection_sub_menu.empty();
        _.each(this.submenus, function(item) {
          var list_item;
          list_item = $("<li><a href='#'>" + item.title + "</a></li>");
          list_item.find("a").data('ownerid', item.ownerid).on("click", function(evt) {
            var owner_id;
            owner_id = $(evt.currentTarget).data("ownerid");
            return item.get(owner_id, function(result) {
              return _this.showImageCollection("album", result);
            });
          });
          return _this.image_collection_sub_menu.append(list_item);
        });
        return this.image_collection_sub_menu.show();
      };

      PhotoGallery.prototype.showImages = function(image_collection) {
        console.log("showing images");
        this.image_list.empty();
        return this.append_images(image_collection);
      };

      PhotoGallery.prototype.append_images = function(images) {
        var image_element_template,
          _this = this;
        image_element_template = _.template("<li class=''>\n	<img src='<%= photo_url%>' id='<%=id%>' class='picture thumbnail' />\n</li>");
        _.each(images.images, function(item) {
          var img_el;
          img_el = $(image_element_template(item));
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
          return _this.image_list.append(img_el);
        });
        if (images.pager) {
          return this.image_pager_btn.show().unbind().on("click", function() {
            return images.pager.nextResult(this.append_images);
          });
        } else {
          return this.image_pager_btn.hide();
        }
      };

      PhotoGallery.prototype.showImageCollection = function(photo_source, data) {
        var append_photos, collection_template,
          _this = this;
        console.log("show image collection");
        collection_template = _.template("<li class=' album'>\n	<img src=\"<%= cover_url%>\" \n	  id='<%= id %>'\n		class='picture thumbnail photo-collection' \n		data-collectionid=\"<%=id%>\"\n		data-collectionname=\"<%=name%>\"\n		\n		data-photosource=\"<%=photosource%>\" />\n		<span class=\"photo-collection-label\"><%=name%></span>\n</li>");
        append_photos = function(photos) {
          _.each(photos.collection, function(datum) {
            var template_data, _ref;
            template_data = {
              id: datum.id,
              name: datum.name,
              cover_url: (_ref = datum.cover_url) != null ? _ref : '/images/placeholder.jpg',
              "photosource": photo_source,
              owner: JSON.stringify(datum.owner)
            };
            return _this.image_list.append(collection_template(template_data));
          });
          if (photos.pager) {
            return _this.image_pager_btn.show().unbind().on("click", function() {
              return photos.pager.nextResult(append_photos);
            });
          } else {
            return _this.image_pager_btn.hide();
          }
        };
        this.image_list.empty();
        return append_photos(data);
      };

      return PhotoGallery;

    })();
    return togglePhotoContent = function(content_el) {
      return content_el.toggle('slide', {
        easing: 'easeOutQuint',
        direction: 'down'
      }, 1000);
    };
  });

}).call(this);
