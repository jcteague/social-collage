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
