(function() {

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

}).call(this);
