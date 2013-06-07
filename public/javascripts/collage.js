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

      Collage.prototype.getPreviewImage = function() {
        return this.stage.toDataURLWithMultiplier("jpeg", .25, .8);
      };

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
