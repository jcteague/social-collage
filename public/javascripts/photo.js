(function() {

  define(['jquery', 'kinetic', 'EventEmitter'], function($, Kinetic, event_emitter) {
    var Photo;
    return Photo = (function() {

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
            return event_emitter.emit("ItemSelected", "Image", _this);
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
  });

}).call(this);
