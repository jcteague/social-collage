(function() {
  var App, Collage, Photo, RotateSlider, ToolBar, facebookLogin, fb_photo_dropped, initialize,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = Array.prototype.slice;

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
        return initialize();
      } else {
        return facebookLogin();
      }
    });
  };

  (function(d) {
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

  facebookLogin = function() {
    return FB.login(function(response) {
      if (response.authResponse) {}
    });
  };

  initialize = function(authResponse) {
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

  App = (function() {

    function App(canvas_element, event_emitter) {
      this.canvas_element = canvas_element;
      this.event_emitter = event_emitter;
      this.onToolbarItemSelected = __bind(this.onToolbarItemSelected, this);
      this.onCanvasItemClick = __bind(this.onCanvasItemClick, this);
      this.collage = new App.Collage(this.canvas_element, this.event_emitter);
      this.collageItemClick = App.Commands.Resize.action;
      event_emitter.on("ItemSelected", this.onCanvasItemClick);
      event_emitter.on("Toolbar.MenuItemSelected", this.onToolbarItemSelected);
    }

    App.prototype.setToolbarAction = function(action) {
      this.toolbarAction = action;
      return this.event_emitter.emit("toolbar-action-selected", action);
    };

    App.prototype.emit = function() {
      var event_name, event_parameters;
      event_name = arguments[0], event_parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.event_emmitter.emit(event_name, event_parameters);
    };

    App.prototype.onCanvasItemClick = function(item_type, item) {
      console.log("" + item_type + " clicked");
      return this.collageItemClick(item);
    };

    App.prototype.onToolbarItemSelected = function(command) {
      return this.collageItemClick = App.Commands[command].action;
    };

    return App;

  })();

  App.Commands = {};

  App.Commands.Resize = {
    action: function(collage_item) {
      var bl, br, canvas_group, canvas_item, item_position, tl, tr, _ref,
        _this = this;
      console.log("making image resizable");
      canvas_group = collage_item.group;
      _ref = collage_item.corners, tl = _ref.tl, tr = _ref.tr, bl = _ref.bl, br = _ref.br;
      canvas_item = collage_item.item;
      item_position = canvas_item.getPosition();
      tl.on("dragmove", function() {
        var img_height, img_width;
        tr.attrs.y = tl.attrs.y;
        bl.attrs.x = tl.attrs.x;
        img_width = tr.attrs.x - tl.attrs.x;
        img_height = bl.attrs.y - tl.attrs.y;
        canvas_item.setPosition(tl.attrs.x + 6, tl.attrs.y + 6);
        return canvas_item.setSize(img_width, img_height);
      });
      bl.on("dragmove", function() {
        var img_height, img_width;
        tl.attrs.x = bl.attrs.x;
        br.attrs.y = bl.attrs.y;
        img_width = tr.attrs.x - tl.attrs.x;
        img_height = bl.attrs.y - tl.attrs.y;
        canvas_item.setPosition(tl.attrs.x + 6, tl.attrs.y + 6);
        return canvas_item.setSize(img_width, img_height);
      });
      tr.on("dragmove", function() {
        var img_height, img_width;
        tl.attrs.y = tr.attrs.y;
        br.attrs.x = tr.attrs.x;
        img_width = tr.attrs.x - tl.attrs.x;
        img_height = bl.attrs.y - tl.attrs.y;
        canvas_item.setPosition(tl.attrs.x + 6, tl.attrs.y + 6);
        return canvas_item.setSize(img_width, img_height);
      });
      br.on("dragmove", function() {
        var img_height, img_width;
        bl.attrs.y = br.attrs.y;
        tr.attrs.x = br.attrs.x;
        img_width = tr.attrs.x - tl.attrs.x;
        img_height = bl.attrs.y - tl.attrs.y;
        canvas_item.setPosition(tl.attrs.x + 6, tl.attrs.y + 6);
        return canvas_item.setSize(img_width, img_height);
      });
      _.each([tl, tr, br, bl], function(corner) {
        var _this = this;
        corner.show();
        corner.on("mousedown", function() {
          console.log("tl mousedown");
          canvas_group.setDraggable(false);
          return canvas_group.moveToTop();
        });
        return corner.on("dragend", function() {
          return canvas_group.setDraggable(true);
        });
      });
      return canvas_item.getLayer().draw();
    }
  };

  App.Commands.Rotate = {
    action: function(collage_item) {
      var c, canvas_group, canvas_item, center_vector, corners, drag_start_position, image_center;
      console.log("rotating");
      canvas_group = collage_item.group;
      canvas_item = collage_item.item;
      corners = (function() {
        var _results;
        _results = [];
        for (c in collage_item.corners) {
          _results.push(collage_item.corners[c]);
        }
        return _results;
      })();
      image_center = {
        x: canvas_item.attrs.x + (canvas_item.attrs.width / 2),
        y: canvas_item.attrs.y + (canvas_item.attrs.height / 2)
      };
      center_vector = Vector.create([image_center.x, image_center.y]);
      console.log(image_center);
      drag_start_position = {
        x: 0,
        y: 0
      };
      _.each(corners, function(c) {
        c.show();
        c.on("dragstart", function() {
          canvas_group.setDraggable(false);
          drag_start_position.x = c.attrs.x;
          return drag_start_position.y = c.attrs.y;
        });
        c.on("dragend", function() {
          return canvas_group.setDraggable(true);
        });
        return c.on("dragmove", function(evt) {
          var current_vector, start_vector, theta;
          console.log(this);
          console.log("drag start " + drag_start_position.x + ", " + drag_start_position.y);
          start_vector = Vector.create([drag_start_position.x, drag_start_position.y]);
          current_vector = Vector.create([this.attrs.x, this.attrs.y]);
          theta = current_vector.angleFrom(start_vector);
          console.log("theta: " + (theta * 360 / Math.PI));
          return canvas_group.rotate(theta);
        });
      });
      return canvas_item.getLayer().draw();
    }
  };

  App.RotateSlider = RotateSlider = (function() {

    function RotateSlider(container, event_emmitter) {
      this.container = container;
      this.event_emmitter = event_emmitter;
      this.onSlide = __bind(this.onSlide, this);
      this.slide_element = $('<div id="rotate-slider" class="slider">').slider({
        min: -180,
        max: 180,
        slide: this.onSlide
      });
      this.rotate_value_element = $('<span id="#rotate-value">').text('0');
      $("#" + this.container).append(this.slide_element).append(this.rotate_value_element);
    }

    RotateSlider.prototype.onSlide = function(evt, ui) {
      console.log("slide");
      this.rotate_value_element.text(ui.value);
      return this.event_emmitter.emit("rotation.changed", ui.value);
    };

    return RotateSlider;

  })();

  App.Collage = Collage = (function() {

    function Collage(canvas_element, event_emitter) {
      var _this = this;
      this.canvas_element = canvas_element;
      this.event_emitter = event_emitter;
      this.canvas = $("#" + this.canvas_element);
      this.stage = new Kinetic.Stage({
        container: canvas_element,
        width: 600,
        height: 500
      });
      this.layer = new Kinetic.Layer();
      this.container = new Kinetic.Container();
      this.stage.add(this.layer);
      this.activeImage = null;
      this.images = [];
      this.canvas.on("click", function(evt) {
        var cnvs_item;
        console.log("canvas clicked");
        cnvs_item = _this.container.getIntersections(evt.offsetX, evt.offsetY);
        if ((_this.currentItem != null) && cnvs_item.length === 0) {
          console.log(_this.currentItem);
          _this.currentItem.noLongerActive();
          return _this.currentItem = null;
        }
      });
      this.event_emitter.on("ItemSelected", function(type, item) {
        var _ref;
        console.log("Item Selected Event");
        if ((_ref = _this.currentItem) != null) _ref.noLongerActive();
        return _this.currentItem = item;
      });
      this.event_emitter.on("rotation.changed", function(value) {
        var _ref;
        return (_ref = _this.currentItem) != null ? _ref.rotate(value) : void 0;
      });
    }

    Collage.prototype.dimensions = function() {
      return this.stage.getSize();
    };

    Collage.prototype.screenPosition = function() {
      return this.canvas.position();
    };

    Collage.prototype.addImage = function(imageSrc) {
      var canvas_image, onImageCreated,
        _this = this;
      console.log("adding image");
      onImageCreated = function(k_image) {
        _this.container.add(k_image);
        _this.layer.add(k_image);
        return _this.stage.draw();
      };
      canvas_image = new App.Photo(imageSrc, onImageCreated);
      return this.images.push(canvas_image);
    };

    Collage.prototype.addFbPhoto = function(image_data) {
      var collage_dimensions, imageToAdd;
      collage_dimensions = this.dimensions();
      imageToAdd = _.find(image_data.fbData.images, function(image) {
        return image.width <= collage_dimensions.width && image.height <= collage_dimensions.height;
      });
      return this.addImage({
        src: imageToAdd.source,
        width: imageToAdd.width,
        height: imageToAdd.height,
        x: image_data.offsetX,
        y: image_data.offsetY
      });
    };

    return Collage;

  })();

  App.Photo = Photo = (function() {

    function Photo(image_data, onImageLoaded) {
      var _this = this;
      this.deSelectSteps = [];
      this.img = new Image();
      this.group = new Kinetic.Group({
        draggagle: true
      });
      this.img.onload = function() {
        _this.image_center = {
          x: image_data.width / 2,
          y: image_data.height / 2
        };
        _this.item = new Kinetic.Image({
          image: _this.img,
          x: image_data.x,
          y: image_data.y,
          width: image_data.width,
          height: image_data.height,
          name: 'image',
          draggagle: true
        });
        _this.group.add(_this.item);
        _this.add_corners();
        _this.item.on('click', function() {
          return app.event_emitter.emit("ItemSelected", "Image", _this);
        });
        return onImageLoaded(_this.group);
      };
      this.img.src = image_data.src;
    }

    Photo.prototype.add_corners = function() {
      var getAnchor, item_position, k, v, _ref, _results;
      getAnchor = function(x, y, name) {
        return new Kinetic.Rect({
          x: x,
          y: y,
          name: name,
          fill: '#000000',
          width: 12,
          height: 12,
          visible: false,
          draggable: true
        });
      };
      item_position = this.item.getPosition();
      this.corners = {
        tl: getAnchor(item_position.x - 6, item_position.y - 6, 'topLeft'),
        tr: getAnchor(item_position.x + this.item.getWidth() - 6, item_position.y - 6, 'topRight'),
        bl: getAnchor(item_position.x - 6, item_position.y - 6 + this.item.getHeight(), 'bottomRight'),
        br: getAnchor(item_position.x + this.item.getWidth() - 6, item_position.y - 6 + this.item.getHeight(), 'bottomLeft')
      };
      _ref = this.corners;
      _results = [];
      for (k in _ref) {
        v = _ref[k];
        _results.push(this.group.add(v));
      }
      return _results;
    };

    Photo.prototype.noLongerActive = function() {
      var corner, x, _ref;
      _ref = this.corners;
      for (x in _ref) {
        corner = _ref[x];
        corner.hide();
      }
      this.group.setDraggable(true);
      return this.group.getLayer().draw();
    };

    Photo.prototype.rotate = function(degree) {
      var cr, dr, new_rotation;
      this.group.setOffset(this.image_center.x, this.image_center.y);
      this.group.setPosition(this.image_center.x, this.image_center.y);
      cr = this.group.getRotationDeg();
      dr = degree - cr;
      new_rotation = cr + dr;
      console.log("photo: rotating " + new_rotation);
      this.group.setRotationDeg(new_rotation);
      this.group.getLayer().draw();
      return this.group.setOffset(0, 0);
    };

    return Photo;

  })();

  App.ToolBar = ToolBar = (function() {

    function ToolBar(items_class_selector) {
      var _this = this;
      this.toolbar_items = $(items_class_selector);
      this.set_initial_active();
      this.toolbar_items.click(function(evt, ui) {
        var command_name;
        command_name = $(evt.currentTarget).data('action');
        console.log("#command clicked: " + command_name);
        _this.set_active($(evt.currentTarget));
        return app.event_emitter.emit('Toolbar.MenuItemSelected', command_name);
      });
    }

    ToolBar.prototype.set_active = function(toolbar_item) {
      toolbar_item.addClass('active');
      if (this.active != null) this.active.removeClass('active');
      return this.active = toolbar_item;
    };

    ToolBar.prototype.set_initial_active = function() {
      var active_item, i, _i, _len, _ref;
      _ref = this.toolbar_items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if ($(i).hasClass('active')) active_item = $(i);
      }
      if (active_item == null) active_item = this.toolbar_items[0];
      return this.set_active(active_item);
    };

    return ToolBar;

  })();

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
