(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['fabric', 'EventEmitter'], function(fabric, event_emitter) {
    var BorderCommand;
    return BorderCommand = (function() {
      function BorderCommand(menu, on_applied, on_deactivate) {
        this.menu = menu;
        this.on_applied = on_applied;
        this.on_deactivate = on_deactivate;
        this.remove_border = __bind(this.remove_border, this);
      }

      BorderCommand.prototype.activate = function(canvas_item) {
        var f_item,
          _this = this;
        this.canvas_item = canvas_item;
        f_item = this.canvas_item.item;
        this.original_border = {
          strokWidth: f_item.get('strokeWidth', f_item.get('stroke'))
        };
        this.menu.setBorderWidth(f_item.get('strokeWidth'));
        this.menu.setBorderColor(f_item.get('stroke'));
        event_emitter.on("submenu.border.widthSet", function(evt) {
          _this.canvas_item.item.set("strokeWidth", evt.borderSize);
          return _this.canvas_item.stage.renderAll();
        });
        event_emitter.on("submenu.border.colorSet", function(evt) {
          var rgb;
          rgb = "rgba(" + evt.color.r + "," + evt.color.g + "," + evt.color.b + "," + evt.color.a + ")";
          console.log(rgb);
          _this.canvas_item.item.set("stroke", rgb);
          return _this.canvas_item.stage.renderAll();
        });
        event_emitter.on('submenu.apply.border', function() {
          return _this.on_applied();
        });
        return event_emitter.on('submenu.cancel.border', function() {
          return _this.deactivate();
        });
      };

      BorderCommand.prototype.deactivate = function() {
        this.remove_border();
        return this.on_deactivate();
      };

      BorderCommand.prototype.remove_border = function() {
        this.canvas_item.item.set(this.original_border);
        return this.canvas_item.stage.renderAll();
      };

      return BorderCommand;

    })();
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'EventEmitter', 'SubMenu'], function($, event_emitter, SubMenu) {
    var BorderSubMenu;
    return BorderSubMenu = (function(_super) {
      __extends(BorderSubMenu, _super);

      function BorderSubMenu() {
        this.setBorderColor = __bind(this.setBorderColor, this);
        this.setBorderWidth = __bind(this.setBorderWidth, this);
        var _this = this;
        BorderSubMenu.__super__.constructor.call(this, '#border-submenu');
        this.border_size = $('#border-size');
        this.border_color = $('#border-color-picker').colorpicker();
        this.border_size.on("blur", function(evt) {
          var size;
          console.log("size blur");
          size = $(evt.currentTarget).val();
          console.log(size);
          return event_emitter.emit("submenu.border.widthSet", {
            borderSize: size
          });
        });
        this.border_color.on("changeColor", function(ev) {
          console.log("border color change");
          return event_emitter.emit("submenu.border.colorSet", {
            color: ev.color.toRGB()
          });
        });
        $('#border-apply').on('click', function(evt) {
          return event_emitter.emit("submenu.apply.border");
        });
        $('#border-cancel').on('click', function(evt) {
          return event_emitter.emit("submenu.cancel.border");
        });
      }

      BorderSubMenu.prototype.setBorderWidth = function(width) {
        console.log("border width " + width);
        return this.border_size.val(width);
      };

      BorderSubMenu.prototype.setBorderColor = function(color) {
        return console.log("border color " + color);
      };

      return BorderSubMenu;

    })(SubMenu);
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define("ToolbarItem-border", ["ToolbarItem", "BorderCommand", "BorderSubMenu"], function(ToolbarItem, BorderCommand, SubMenu) {
    var RemoveToolbarItem;
    return RemoveToolbarItem = (function(_super) {
      __extends(RemoveToolbarItem, _super);

      function RemoveToolbarItem(toolbar) {
        this.toolbar = toolbar;
        RemoveToolbarItem.__super__.constructor.call(this, this.toolbar);
        this.submenu = new SubMenu();
        this.command = new BorderCommand(this.submenu, this.hide_submenu, this.hide_submenu);
      }

      return RemoveToolbarItem;

    })(ToolbarItem);
  });

}).call(this);

(function() {
  define(['Commands'], function(commands) {
    return {};
  });

}).call(this);

(function() {
  define(['fabric', 'EventEmitter'], function(fabric, event_emitter) {
    var CropCommand;
    return CropCommand = (function() {
      function CropCommand(on_applied, on_deactivate) {
        this.on_applied = on_applied;
        this.on_deactivate = on_deactivate;
      }

      CropCommand.prototype.lock_item = function(img, stage) {
        img.set('lockMovementX', true);
        img.set('lockMovementY', true);
        img.set('lockRotation', true);
        img.set('lockScalingX', true);
        img.set('lockScalingY', true);
        return img.set('hasControls', false);
      };

      CropCommand.prototype.reset_img = function(img) {
        img.set('lockMovementX', false);
        img.set('lockMovementY', false);
        img.set('lockRotation', false);
        img.set('lockScalingX', false);
        img.set('lockScalingY', false);
        return img.set('hasControls', true);
      };

      CropCommand.prototype.activate = function(canvas_item) {
        var f_img, img_bounds,
          _this = this;
        this.canvas_item = canvas_item;
        this.stage = this.canvas_item.stage;
        console.log(this.canvas_item);
        f_img = this.canvas_item.item;
        this.lock_item(f_img, this.stage);
        img_bounds = f_img.getBoundingRect();
        this.cropping_rect = new fabric.Rect({
          top: f_img.top,
          left: f_img.left,
          width: f_img.width - 1,
          height: f_img.height - 1,
          angle: f_img.angle,
          scaleX: f_img.scaleX,
          scaleY: f_img.scaleY,
          fill: "grey",
          opacity: .6,
          lockRotation: true
        });
        this.stage.add(this.cropping_rect);
        this.stage.setActiveObject(this.cropping_rect);
        event_emitter.on('submenu.apply.crop', function() {
          var crop_bounds, crop_dimensions, crop_height, crop_image, crop_image_bounds, crop_width, crop_x, crop_y, img_angle;
          crop_image = _this.canvas_item.item;
          crop_image_bounds = crop_image.getBoundingRect();
          img_angle = f_img.get('angle');
          crop_bounds = _this.cropping_rect.getBoundingRect();
          crop_x = Math.round(crop_bounds.left - crop_image_bounds.left);
          crop_y = Math.round(crop_bounds.top - crop_image_bounds.top);
          crop_width = Math.round(crop_bounds.width);
          crop_height = Math.round(crop_bounds.height);
          console.log("imag bounds");
          console.log(crop_image_bounds);
          console.log("cropping");
          console.log(crop_image);
          _this.stage.remove(_this.cropping_rect);
          _this.reset_img(crop_image);
          crop_dimensions = {
            x: crop_x,
            y: crop_y,
            width: crop_width,
            height: crop_height
          };
          console.log(crop_dimensions);
          _this.stage.crop(crop_image, crop_dimensions);
          return _this.on_applied();
        });
        return event_emitter.on('submenu.cancel.crop', function() {
          return _this.deactivate();
        });
      };

      CropCommand.prototype.deactivate = function(canvas_item) {
        this.stage.remove(this.cropping_rect);
        this.reset_img(this.canvas_item.item);
        this.stage.renderAll();
        return this.on_deactivate();
      };

      return CropCommand;

    })();
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'EventEmitter', 'SubMenu'], function($, event_emitter, SubMenu) {
    var CropSubMenu;
    return CropSubMenu = (function(_super) {
      __extends(CropSubMenu, _super);

      function CropSubMenu(top_menu, on_close) {
        CropSubMenu.__super__.constructor.call(this, '#crop-submenu');
        $('#crop-submenu').on('click', '#crop-apply', function(evt, ui) {
          var event_name;
          event_name = $(this).data('event');
          console.log("crop submenu " + event_name);
          return event_emitter.emit(event_name);
        });
        $('#crop-submenu').on('click', '#crop-cancel', function(evt, ui) {
          var event_name;
          event_name = $(this).data('event');
          console.log("crop submenu " + event_name);
          return event_emitter.emit(event_name);
        });
      }

      return CropSubMenu;

    })(SubMenu);
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define("ToolbarItem-crop", ["ToolbarItem", "CropCommand", "CropSubMenu"], function(ToolbarItem, CropCommand, CropSubMenu) {
    var CropToolbarItem;
    return CropToolbarItem = (function(_super) {
      __extends(CropToolbarItem, _super);

      function CropToolbarItem(toolbar) {
        this.toolbar = toolbar;
        CropToolbarItem.__super__.constructor.call(this, this.toolbar);
        this.submenu = new CropSubMenu();
        this.command = new CropCommand(this.hide_submenu, this.hide_submenu);
      }

      return CropToolbarItem;

    })(ToolbarItem);
  });

}).call(this);

(function() {
  define(['EventEmitter2'], function(Em) {
    var getInstance;
    getInstance = function() {
      var em;
      if (!em) {
        console.log("initializing event emitter");
        em = new Em();
      }
      return em;
    };
    return getInstance();
  });

}).call(this);

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
        collection_id = el.data('collectionid');
        collection_name = el.data('collectionname');
        collection_owner = el.data('collectionowner');
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
        collection_template = _.template("<li class=' album'>\n	<img src=\"<%= cover_url%>\" \n	  id='<%= id %>'\n		class='picture thumbnail photo-collection' \n		data-collectionid=\"<%=id%>\"\n		data-collectionname=\"<%=name%>\"\n		data-collectionowner=\"<%=owner%>\"\n		data-photosource=\"<%=photosource%>\" />\n		<span class=\"photo-collection-label\"><%=name%></span>\n</li>");
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

(function() {
  define(["fabric", "EventEmitter"], function(fabric, event_emitter) {
    var RemoveCommand;
    return RemoveCommand = (function() {
      function RemoveCommand(on_applied, on_deactivate) {
        this.on_applied = on_applied;
        this.on_deactivate = on_deactivate;
      }

      RemoveCommand.prototype.activate = function(collage_item) {
        var stage;
        this.collage_item = collage_item;
        stage = this.collage_item.stage;
        stage.remove(collage_item.item);
        event_emitter.emit("ItemRemoved", this.collage_item);
        return this.on_applied();
      };

      RemoveCommand.prototype.deactivate = function(collage_item) {
        this.collage_item = collage_item;
        return this.on_deactivate();
      };

      return RemoveCommand;

    })();
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define("ToolbarItem-remove", ["ToolbarItem", "RemoveCommand", "exports"], function(ToolbarItem, RemoveCommand, exports) {
    var RemoveToolbarItem;
    return RemoveToolbarItem = (function(_super) {
      __extends(RemoveToolbarItem, _super);

      function RemoveToolbarItem(toolbar) {
        this.toolbar = toolbar;
        RemoveToolbarItem.__super__.constructor.call(this, this.toolbar);
        this.command = new RemoveCommand();
      }

      return RemoveToolbarItem;

    })(ToolbarItem);
  });

}).call(this);

(function() {
  define(["fabric", "EventEmitter"], function(fabric, event_emitter) {
    var ShadowCommand;
    return ShadowCommand = (function() {
      function ShadowCommand(on_deactivate) {
        this.on_deactivate = on_deactivate;
      }

      ShadowCommand.prototype.activate = function(collage_item) {
        var item, shadow, stage;
        this.collage_item = collage_item;
        stage = this.collage_item.stage;
        item = this.collage_item.item;
        shadow = {
          color: "rgba(0,0,0,0.5)",
          offsetX: 10,
          offsetY: 10,
          blur: 20,
          affectStroke: true
        };
        item.setShadow(shadow);
        return stage.renderAll();
      };

      ShadowCommand.prototype.deactivate = function(collage_item) {
        this.collage_item = collage_item;
      };

      return ShadowCommand;

    })();
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define("ToolbarItem-shadow", ["ToolbarItem", "ShadowCommand"], function(ToolbarItem, RemoveCommand) {
    var RemoveToolbarItem;
    return RemoveToolbarItem = (function(_super) {
      __extends(RemoveToolbarItem, _super);

      function RemoveToolbarItem(toolbar) {
        this.toolbar = toolbar;
        RemoveToolbarItem.__super__.constructor.call(this, this.toolbar);
        this.command = new RemoveCommand();
      }

      return RemoveToolbarItem;

    })(ToolbarItem);
  });

}).call(this);

(function() {
  define(["jquery"], function($) {
    var SubMenu;
    return SubMenu = (function() {
      function SubMenu(selector) {
        this.selector = selector;
      }

      SubMenu.prototype.show = function() {
        return $(this.selector).show();
      };

      SubMenu.prototype.hide = function() {
        return $(this.selector).hide();
      };

      return SubMenu;

    })();
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['require', 'jquery', 'EventEmitter'], function(require, $, event_emitter) {
    var ToolbarItem;
    return ToolbarItem = (function() {
      function ToolbarItem(toolbar) {
        this.toolbar = toolbar;
        this.hide_submenu = __bind(this.hide_submenu, this);
        this.show_submenu = __bind(this.show_submenu, this);
      }

      ToolbarItem.prototype.show_submenu = function() {
        if (this.submenu) {
          this.toolbar.hide_menu();
          return this.submenu.show();
        }
      };

      ToolbarItem.prototype.hide_submenu = function() {
        if (this.submenu) {
          this.submenu.hide();
          return this.toolbar.show_menu();
        }
      };

      ToolbarItem.prototype.activate = function(canvas_item) {
        var _this = this;
        this.show_submenu();
        return this.command.activate(canvas_item, function() {
          return _this.hide_submenu();
        });
      };

      ToolbarItem.prototype.deactivate = function(canvas_item) {
        this.hide_submenu();
        return this.command.deactivate();
      };

      return ToolbarItem;

    })();
  });

}).call(this);

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
        var process_album,
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
        return FB.api("" + context.url + "?fields=id,name,cover_photo,from", function(albums) {
          console.log(albums);
          return async.map(albums.data, process_album, function(err, result) {
            return cb({
              "collection": result,
              title: "Your Albums"
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

(function() {
  define(['EventEmitter', 'Collage', 'Toolbar', 'PhotoGallery'], function(event_emitter, Collage, Toolbar, photoGallery) {
    var App;
    return App = (function() {
      function App(canvas_element) {
        var diagnostics;
        this.canvas_element = canvas_element;
        this.collage = new Collage(this.canvas_element);
        this.toolbar = new Toolbar('#collage-menu-list');
        diagnostics = $('<div>', {
          id: "diagnostics"
        });
        diagnostics.append("<h3>diagnostics</h3>\n<div>\n	<span>canvas mouse: x: <span id=\"canvas-mouse-x\"></span>,y:<span id=\"canvas-mouse-y\"></span></span>\n</div>");
        $('body').append(diagnostics);
        event_emitter.on("canvas:mousemove", function(evt) {
          $('#canvas-mouse-x').text(evt.x);
          return $('#canvas-mouse-y').text(evt.y);
        });
      }

      return App;

    })();
  });

}).call(this);

(function() {
  define(['jqueryUI', 'fabric', 'EventEmitter', 'Photo'], function($, fabric, event_emitter, Photo) {
    var Collage;
    return Collage = (function() {
      function Collage(canvas_element) {
        var image_dropped,
          _this = this;
        this.canvas_element = canvas_element;
        this.canvas = $("#" + this.canvas_element);
        this.canvas_container = this.canvas.parent();
        this.stage = new fabric.Canvas(this.canvas_element);
        this.stage.setWidth(this.canvas_container.width());
        this.stage.setHeight(this.canvas_container.height());
        this.enableDiagnostics();
        this.activeImage = null;
        this.collage_items = [];
        image_dropped = function(evt, ui) {
          var img, img_data, mouse_position;
          console.log("photo image dropped");
          console.log("event position");
          console.log(ui.position);
          console.log("fabric mouse position");
          mouse_position = _this.stage.getPointer();
          img = $(ui.draggable);
          img_data = {
            x: mouse_position.x,
            y: mouse_position.y,
            data: img.data('img_data')
          };
          console.log(img_data);
          return _this.addFbPhoto(img_data);
        };
        this.canvas.droppable({
          drop: image_dropped
        });
        this.stage.on("selection:created", function(evt) {
          console.log("object selected");
          return console.log(evt);
        });
        this.stage.on("selection:cleared", function(evt) {
          console.log("object selection cleared");
          return console.log(evt);
        });
        event_emitter.on("ItemRemoved", function(item) {
          return _this.collage_items.splice(item.id, 1);
        });
      }

      Collage.prototype.dimensions = function() {
        return {
          width: this.stage.getWidth(),
          height: this.stage.getHeight()
        };
      };

      Collage.prototype.screenPosition = function() {
        return this.canvas.position();
      };

      Collage.prototype.addImage = function(imageSrc) {
        var photo_id,
          _this = this;
        console.log("adding image");
        console.log(imageSrc);
        photo_id = this.collage_items.length;
        return this.collage_items.push(new Photo(photo_id, imageSrc, this.stage, function(cnvs_image) {
          console.log(cnvs_image);
          _this.stage.add(cnvs_image);
        }));
      };

      Collage.prototype.find_item = function(x, y) {
        var i;
        return ((function() {
          var _i, _len, _ref, _results;
          _ref = this.collage_items;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            if (i.intersects(x, y)) {
              _results.push(i);
            }
          }
          return _results;
        }).call(this))[0];
      };

      Collage.prototype.addFbPhoto = function(image_data) {
        var collage_dimensions, imageToAdd;
        collage_dimensions = this.dimensions();
        imageToAdd = _.find(image_data.data.images, function(image) {
          return image.width <= collage_dimensions.width && image.height <= collage_dimensions.height;
        });
        return this.addImage({
          src: '/images?src=' + imageToAdd.source,
          width: imageToAdd.width,
          height: imageToAdd.height,
          x: image_data.x + (imageToAdd.width / 2),
          y: image_data.y + (imageToAdd.height / 2)
        });
      };

      Collage.prototype.enableDiagnostics = function() {
        return this.stage.on("mouse:move", function(evt) {
          return event_emitter.emit("canvas:mousemove", {
            x: evt.e.offsetX,
            y: evt.e.offsetY
          });
        });
      };

      return Collage;

    })();
  });

}).call(this);

(function() {
  define(["CropCommand", "CropSubMenu"], function(crop, cropSubMenu) {
    return {
      'crop': {
        command: crop,
        submenu: cropSubMenu
      }
    };
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  require(['jquery', 'fabric'], function($, fabric) {
    var Crop;
    Crop = (function() {
      function Crop(canvas) {
        this.canvas = canvas;
        this.constrain_box_size = __bind(this.constrain_box_size, this);
        this.selected_element = this.canvas.getActiveObject();
        console.log(this.selected_element);
        this.crop_box = this.create_cropping_box();
      }

      Crop.prototype.constrain_box_size = function(evt) {
        var box_bounds, photo_bounds;
        box_bounds = evt.target.getBoundingRect();
        photo_bounds = this.selected_element.getBoundingRect();
        if (box_bounds.left < photo_bounds.left) {
          console.log("moved past picture left");
          return this.evt.target.set('lockScalingX', true);
        }
      };

      Crop.prototype.crop = function() {
        var crop_bounds, crop_height, crop_width, crop_x, crop_y, ctx, img, img_bounds;
        console.log("cropping");
        this.selected_element.set('angle', 0);
        this.crop_box.set('angle', 0);
        this.stage.renderAll();
        ctx = this.canvas.getContext();
        img = this.selected_element._element;
        img_bounds = this.selected_element.getBoundingRect();
        crop_bounds = this.crop_box.getBoundingRect();
        crop_x = Math.round(crop_bounds.left - img_bounds.left);
        crop_y = Math.round(crop_bounds.top - img_bounds.top);
        crop_width = crop_bounds.width;
        crop_height = crop_bounds.height;
        console.log("" + crop_x + ", " + crop_y + "," + crop_width + ", " + crop_height);
        console.log("cropping bounds");
        this.canvas.remove(this.crop_box);
        this.canvas.crop(this.selected_element, crop_x, crop_y, crop_width, crop_height);
        return this.selected_element.set('hasControls', true);
      };

      Crop.prototype.create_cropping_box = function() {
        var cropping_rect;
        cropping_rect = new fabric.Rect({
          top: this.selected_element.top,
          left: this.selected_element.left,
          width: this.selected_element.width,
          height: this.selected_element.height,
          angle: this.selected_element.angle,
          fill: "grey",
          opacity: .45,
          lockRotation: true
        });
        this.canvas.add(cropping_rect);
        this.selected_element.set('hasControls', false);
        return cropping_rect;
      };

      return Crop;

    })();
    return $(function() {
      var cropper, f_cnvs, f_img, img;
      console.log("crop test setup");
      f_cnvs = new fabric.Canvas("cnvs");
      img = document.getElementById("pic");
      f_img = new fabric.Image(img, {
        left: 600,
        top: 400,
        angle: 0
      });
      f_cnvs.add(f_img);
      cropper = {};
      $('#add-crop').click(function() {
        return cropper = new Crop(f_cnvs);
      });
      return $('#crop').click(function() {
        return cropper.crop();
      });
    });
  });

}).call(this);

(function() {
  requirejs.config({
    paths: {
      "jquery": "jquery-1.7.2.min",
      "underscore": "underscore-min",
      "jqueryUI": "jqueryui-min",
      "bootstrap": "bootstrap",
      "EventEmitter2": "eventemitter2",
      "async": "async",
      "fabric": "fabric",
      "sylvester": "sylvester",
      "wijmoUtil": "jquery.wijmo.wijutil.min",
      "wijmoSplitter": "jquery.wijmo.wijsplitter.min",
      "ColorPicker": "bootstrap-colorpicker",
      "ToolbarItem-remove": "RemoveToolbarItem",
      "ToolbarItem-crop": "CropToolbarItem",
      "ToolbarItem-border": "BorderToolbarItem",
      "ToolbarItem-shadow": "ShadowToolbarItem"
    },
    shim: {
      underscore: {
        exports: '_'
      },
      fabric: {
        exports: 'fabric'
      },
      jqueryUI: {
        exports: '$',
        deps: ['jquery']
      },
      EventEmitter2: {
        exports: "EventEmitter2"
      },
      async: {
        exports: "async"
      },
      wijmoUtil: {
        exports: "wijmoUtil",
        deps: ["jquery"]
      },
      wijmoSplitter: {
        exports: "wijmoSplitter",
        deps: ["jqueryUI", "wijmoUtil"]
      },
      ColorPicker: {
        exports: "ColorPicker",
        deps: ["jquery", "bootstrap"]
      }
    }
  });

  require(['jquery', 'ColorPicker', 'UserPhotos', 'App'], function($, ColorPicker, UserPhotos, App) {
    return $(function() {
      var app, userPhotos;
      userPhotos = new UserPhotos();
      app = new App('collage-canvas');
      console.log("loading dependencies");
      $('.color').colorpicker();
      return $('#logout').click(function() {
        return FB.logout();
      });
    });
  });

}).call(this);

(function() {
  var fb_photo_dropped;

  $(function() {
    var collage_toolbar, rotateSlider;
    window.emitter = new EventEmitter2();
    window.app = new App('canvas-container', emitter);
    collage_toolbar = new App.ToolBar('#collage-menu-list .menu-item');
    $('#login').click(facebookLogin);
    $('#logout').click(function() {
      return FB.logout();
    });
    $('#canvas-container canvas').droppable({
      drop: fb_photo_dropped
    }).css({
      border: 'solid black 1px'
    });
    return rotateSlider = new RotateSlider('sub-menu', window.emitter);
  });

  fb_photo_dropped = function(evt, ui) {
    var img, img_data;
    console.log("photo image dropped");
    console.dir(evt);
    console.dir(ui);
    img = $(ui.draggable);
    img_data = {
      offsetX: evt.offsetX,
      offsetY: evt.offsetY,
      fbData: img.data('fb_data')
    };
    console.log(img_data);
    return app.collage.addFbPhoto(img_data);
  };

}).call(this);

(function() {
  var Module, moduleKeywords,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  moduleKeywords = ['extended', 'included'];

  window.Module = Module = (function() {
    function Module() {}

    Module.extend = function(obj) {
      var key, value, _ref;
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this[key] = value;
        }
      }
      if ((_ref = obj.extended) != null) {
        _ref.apply(this);
      }
      return this;
    };

    Module.include = function(obj) {
      var key, value, _ref;
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this.prototype[key] = value;
        }
      }
      if ((_ref = obj.included) != null) {
        _ref.apply(this);
      }
      return this;
    };

    return Module;

  })();

}).call(this);

(function() {
  define(['jquery', 'fabric', 'EventEmitter'], function($, fabric, event_emitter) {
    var Photo;
    return Photo = (function() {
      function Photo(id, image_data, stage, onImageLoaded) {
        this.id = id;
        this.stage = stage;
        this.itemType = 'Photo';
        this.loadImage(image_data, onImageLoaded);
      }

      Photo.prototype.get_center = function() {
        return {
          x: this.item.getX() + (this.item.getWidth() / 2),
          y: this.item.getY() + (this.item.getHeight() / 2)
        };
      };

      Photo.prototype.loadImage = function(image_data, loaded_cb) {
        var _this = this;
        console.log("photo loadImage: ");
        console.log(image_data);
        return new fabric.Image.fromURL(image_data.src, function(f_img) {
          _this.item = f_img;
          _this.item.on("selected", function(evt) {
            console.log("photo selected");
            console.log(evt);
            return event_emitter.emit("ItemSelected", _this);
          });
          loaded_cb(_this.item);
          return _this.item.on("selected:cleared", function(evt) {
            console.log("photo selected cleared");
            return event_emitter.emit('ItemDeSelected', _this);
          });
        }, {
          left: image_data.x,
          top: image_data.y,
          width: image_data.width,
          height: image_data.height
        });
      };

      Photo.prototype.intersects = function(x, y) {
        var x1, x2, y1, y2;
        x1 = this.item.attrs.x;
        x2 = x1 + this.item.attrs.width;
        y1 = this.item.attrs.y;
        y2 = y1 + this.item.attrs.height;
        return (x1 < x && x < x2) && (y1 < y && y < y2);
      };

      Photo.prototype.noLongerActive = function() {
        var corner, x, _ref, _results;
        _ref = this.corners;
        _results = [];
        for (x in _ref) {
          corner = _ref[x];
          _results.push(corner.hide());
        }
        return _results;
      };

      Photo.prototype.getCanvasPosition = function() {};

      Photo.prototype.getScreenPosition = function() {
        var cnvs_position, img_position;
        cnvs_position = $(this.item.getCanvas().element).offset();
        img_position = this.item.getAbsolutePosition();
        return {
          x: cnvs_position.left + img_position.x,
          y: cnvs_position.top + img_position.y
        };
      };

      Photo.prototype.getItemDimensions = function() {
        return {
          width: this.item.getWidth(),
          height: this.item.getHeight()
        };
      };

      return Photo;

    })();
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['require', 'jquery', 'underscore', 'EventEmitter'], function(require, $, _, event_emitter) {
    var ToolBar;
    return ToolBar = (function() {
      function ToolBar(toolbar, default_command) {
        this.applyCommand = __bind(this.applyCommand, this);
        this.on_toolbar_item_click = __bind(this.on_toolbar_item_click, this);
        var _this = this;
        this.toolbar = $(toolbar);
        this.menu_items = {};
        this.toolbar.find('li').each(function(idx, item) {
          var command_name, li;
          li = $(item);
          command_name = li.data("commandname");
          return require(["ToolbarItem-" + command_name], function(ToolbarItem) {
            var menu_item;
            menu_item = new ToolbarItem(_this);
            return _this.menu_items[command_name] = menu_item;
          });
        });
        this.toolbar_items = this.toolbar.find('li');
        event_emitter.on("ItemSelected", function(selected_item) {
          return _this.selected_canvas_item = selected_item;
        });
        event_emitter.on("ItemDeSelected", function() {
          var _ref;
          console.log("toolbar ItemDelected:");
          if ((_ref = _this.current_command) != null) {
            _ref.unbind(_this.selected_canvas_item);
          }
        });
        this.toolbar_items.find('a').click(this.on_toolbar_item_click);
      }

      ToolBar.prototype.hide_menu = function() {
        return this.toolbar.find('a').hide();
      };

      ToolBar.prototype.show_menu = function() {
        return this.toolbar.find('a').show();
      };

      ToolBar.prototype.on_toolbar_item_click = function(evt, ui) {
        var command_name, menu_item, previous_menu_item;
        menu_item = $(evt.currentTarget).parent();
        command_name = menu_item.data('commandname');
        console.log("selected action: " + command_name);
        previous_menu_item = this.current_menu_item;
        this.current_menu_item = this.menu_items[command_name];
        return this.current_menu_item.activate(this.selected_canvas_item);
      };

      ToolBar.prototype.set_initial_active = function() {
        var active_item, i, _i, _len, _ref;
        _ref = this.toolbar_items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if ($(i).hasClass('active')) {
            active_item = $(i);
          }
        }
        if (active_item == null) {
          active_item = this.toolbar_items[0];
        }
        return this.set_active(active_item);
      };

      ToolBar.prototype.applyCommand = function(item) {};

      return ToolBar;

    })();
  });

}).call(this);
