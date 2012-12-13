(function() {

  define(['jqueryUI', 'kinetic', 'EventEmitter', 'Photo'], function($, Kinetic, event_emitter, Photo) {
    var Collage;
    return Collage = (function() {

      function Collage(canvas_element) {
        var image_dropped,
          _this = this;
        this.canvas_element = canvas_element;
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
        image_dropped = function(evt, ui) {
          var img, img_data;
          console.log("photo image dropped");
          img = $(ui.draggable);
          img_data = {
            offsetX: evt.offsetX,
            offsetY: evt.offsetY,
            data: img.data('img_data')
          };
          console.log(img_data);
          return _this.addFbPhoto(img_data);
        };
        this.canvas.find('canvas').droppable({
          drop: image_dropped
        });
        event_emitter.on("ItemSelected", function(type, item) {
          var _ref;
          console.log("Item Selected Event");
          if ((_ref = _this.currentItem) != null) _ref.noLongerActive();
          return _this.currentItem = item;
        });
        event_emitter.on("rotation.changed", function(value) {
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
        canvas_image = new Photo(imageSrc, onImageCreated);
        return this.images.push(canvas_image);
      };

      Collage.prototype.addFbPhoto = function(image_data) {
        var collage_dimensions, imageToAdd;
        collage_dimensions = this.dimensions();
        imageToAdd = _.find(image_data.data.images, function(image) {
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
  });

}).call(this);
