(function() {
  var App, Collage, Photo, ToolBar, facebookLogin, fb_photo_dropped, initialize,
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
      this.collageItemClick = App.Commands.resize;
      event_emitter.on("ItemClicked", this.onCanvasItemClick);
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
      return console.log(command);
    };

    return App;

  })();

  App.Commands = {};

  App.Commands.resize = function(collage_item) {
    var bl, br, canvas_item, getAnchor, group, item_position, tl, tr,
      _this = this;
    console.log("making image resizable");
    canvas_item = collage_item.item;
    group = new Kinetic.Group({
      draggable: true
    });
    group.add(canvas_item);
    getAnchor = function(x, y, name) {
      return new Kinetic.Rect({
        x: x,
        y: y,
        name: name,
        fill: '#000000',
        width: 12,
        height: 12,
        draggable: true
      });
    };
    item_position = canvas_item.getPosition();
    tl = getAnchor(item_position.x - 6, item_position.y - 6, 'topLeft');
    tr = getAnchor(item_position.x + canvas_item.getWidth() - 6, item_position.y - 6, 'topRight');
    bl = getAnchor(item_position.x - 6, item_position.y - 6 + canvas_item.getHeight(), 'bottomRight');
    br = getAnchor(item_position.x + canvas_item.getWidth() - 6, item_position.y - 6 + canvas_item.getHeight(), 'bottomLeft');
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
      corner.on("mousedown", function() {
        console.log("tl mousedown");
        group.setDraggable(false);
        return group.moveToTop();
      });
      return corner.on("dragend", function() {
        return group.setDraggable(true);
      });
    });
    app.collage.layer.add(group);
    return app.collage.layer.draw();
  };

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
        cnvs_item = _this.container.getIntersections(evt.offsetX, evt.offsetY);
        if ((_this.currentItem != null) && cnvs_item.length === 0) {
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
      var img,
        _this = this;
      img = new Image();
      img.onload = function() {
        _this.item = new Kinetic.Image({
          image: img,
          x: image_data.x,
          y: image_data.y,
          width: image_data.width,
          height: image_data.height,
          name: 'image',
          draggagle: true
        });
        _this.item.on('click', function() {
          return app.event_emitter.emit("ItemClicked", "Image", _this);
        });
        return onImageLoaded(_this.item);
      };
      img.src = image_data.src;
    }

    return Photo;

  })();

  App.ToolBar = ToolBar = (function() {

    function ToolBar(items_class_selector) {
      this.toolbar_items = $(items_class_selector);
      this.toolbar_items.click(function(evt, ui) {
        var command_name;
        command_name = $(this).data('action');
        return app.event_emitter.emit('Toolbar.MenuItemSelected', App.Commands[command_name]);
      });
    }

    return ToolBar;

  })();

  $(function() {
    var collage_toolbar;
    window.emitter = new EventEmitter2();
    window.app = new App('canvas-container', emitter);
    collage_toolbar = new App.ToolBar('#collage-menu-list .menu-item');
    $('#login').click(facebookLogin);
    $('#logout').click(function() {
      return FB.logout();
    });
    return $('#canvas-container canvas').droppable({
      drop: fb_photo_dropped
    }).css({
      border: 'solid black 1px'
    });
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
