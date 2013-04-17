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

      Photo.prototype.get_center = function() {
        return {
          x: this.item.getX() + (this.item.getWidth() / 2),
          y: this.item.getY() + (this.item.getHeight() / 2)
        };
      };

      Photo.prototype.loadImage = function(image_data) {
        var center_point;
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
        this.add_corners();
        center_point = new Kinetic.Circle({
          radius: 5,
          x: this.get_center().x,
          y: this.get_center().y,
          fill: "blue"
        });
        return this.group.add(center_point);
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
        y2 = y1 + this.item.attrs.height;
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
        var center, cr, dr, new_rotation, original_position;
        original_position = this.group.getPosition();
        console.log("photo: changing offset before rotation: " + original_position.x + ", " + original_position.y);
        center = this.get_center();
        this.group.setOffset(center.x, center.y);
        this.group.setPosition(center.x, center.y);
        cr = this.group.getRotationDeg();
        dr = degree - cr;
        new_rotation = cr + dr;
        console.log("photo: rotating " + new_rotation);
        this.group.setRotationDeg(new_rotation);
        this.group.getLayer().draw();
        this.group.setOffset(0, 0);
        console.log("photo: resetting after rotation, before reset: " + this.group.attrs.x + "," + this.group.attrs.y);
        this.group.setPosition(original_position);
        return console.log("photo: resetting after rotation: " + this.group.attrs.x + "," + this.group.attrs.y);
      };

      return Photo;

    })();
  });

}).call(this);
