(function() {
  var Photo;

  App.Photo = Photo = (function() {

    function Photo(image_data, onImageLoaded) {
      var img,
        _this = this;
      this.deSelectSteps = [];
      img = new Image();
      this.group = new Kinetic.Group({
        draggagle: true
      });
      img.onload = function() {
        _this.image_center = {
          x: image_data.width / 2,
          y: image_data.height / 2
        };
        _this.item = new Kinetic.Image({
          image: img,
          x: image_data.x + _this.image_center.x,
          y: image_data.y + _this.image_center.y,
          width: image_data.width,
          height: image_data.height,
          name: 'image',
          draggagle: true,
          offset: [_this.image_center.x, _this.image_center.y]
        });
        _this.group.add(_this.item);
        _this.add_corners();
        _this.item.on('click', function() {
          return app.event_emitter.emit("ItemSelected", "Image", _this);
        });
        return onImageLoaded(_this.group);
      };
      img.src = image_data.src;
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
        tl: getAnchor(item_position.x + this.item.attrs.offset[0] - 6, item_position.y + this.item.attrs.offset[1] - 6, 'topLeft'),
        tr: getAnchor(item_position.x + this.item.attrs.offset[0] + this.item.getWidth() - 6, item_position.y + this.item.attrs.offset[1] - 6, 'topRight'),
        bl: getAnchor(item_position.x + this.item.attrs.offset[0] - 6, item_position.y + this.item.attrs.offset[1] - 6 + this.item.getHeight(), 'bottomRight'),
        br: getAnchor(item_position.x + this.item.attrs.offset[0] + this.item.getWidth() - 6, item_position.y + this.item.attrs.offset[1] - 6 + this.item.getHeight(), 'bottomLeft')
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

    return Photo;

  })();

}).call(this);
