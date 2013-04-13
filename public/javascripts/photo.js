// Generated by CoffeeScript 1.4.0
(function() {

  define(['jquery', 'kinetic', 'EventEmitter'], function($, Kinetic, event_emitter) {
    var Photo;
    return Photo = (function() {

      function Photo(image_data, stage, onImageLoaded) {
        var _this = this;
        this.stage = stage;
        this.itemType = 'Photo';
        this.deSelectSteps = [];
        this.img = new Image();
        this.group = new Kinetic.Group({
          draggagle: true
        });
        this.img.onload = function() {
          _this.loadImage(image_data);
          return onImageLoaded(_this.group);
        };
        this.img.src = image_data.src;
      }

      Photo.prototype.draw = function() {
        return this.group.getStage().draw();
      };

      Photo.prototype.loadImage = function(image_data) {
        this.center = {
          x: image_data.width / 2,
          y: image_data.height / 2
        };
        this.item = new Kinetic.Image({
          image: this.img,
          x: image_data.x,
          y: image_data.y,
          width: image_data.width,
          height: image_data.height,
          name: 'image',
          draggagle: true,
          stroke: 'black',
          strokeWidth: 2
        });
        this.group.add(this.item);
        return this.add_corners();
      };

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

      Photo.prototype.intersects = function(x, y) {
        var x1, x2, y1, y2;
        x1 = this.item.attrs.x;
        x2 = x1 + this.item.attrs.width;
        y1 = this.item.attrs.y;
        y2 = y1 + this.item.attrs.width;
        return (x1 < x && x < x2) && (y1 < y && y < y2);
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

      Photo.prototype.getCanvasPosition = function() {
        return this.item.getOffset();
      };

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

      Photo.prototype.rotate = function(degree) {
        var cr, dr, new_rotation;
        this.group.setOffset(this.center.x, this.center.y);
        this.group.setPosition(this.center.x, this.center.y);
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
  });

}).call(this);
