(function() {

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

}).call(this);
