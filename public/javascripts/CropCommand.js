(function() {
  define(['fabric', 'EventEmitter'], function(fabric, event_emitter) {
    var CropCommand;
    return CropCommand = (function() {
      function CropCommand(on_applied, on_deactivate) {
        this.on_applied = on_applied;
        this.on_deactivate = on_deactivate;
      }

      CropCommand.prototype.lock_item = function(img, stage) {
        img.set('lockMovementX', true);
        img.set('lockMovementY', true);
        img.set('lockRotation', true);
        img.set('lockScalingX', true);
        img.set('lockScalingY', true);
        return img.set('hasControls', false);
      };

      CropCommand.prototype.reset_img = function(img) {
        img.set('lockMovementX', false);
        img.set('lockMovementY', false);
        img.set('lockRotation', false);
        img.set('lockScalingX', false);
        img.set('lockScalingY', false);
        return img.set('hasControls', true);
      };

      CropCommand.prototype.activate = function(canvas_item) {
        var f_img, img_bounds,
          _this = this;
        this.canvas_item = canvas_item;
        this.stage = this.canvas_item.stage;
        console.log(this.canvas_item);
        f_img = this.canvas_item.item;
        this.lock_item(f_img, this.stage);
        img_bounds = f_img.getBoundingRect();
        this.cropping_rect = new fabric.Rect({
          top: f_img.top,
          left: f_img.left,
          width: f_img.width - 1,
          height: f_img.height - 1,
          angle: f_img.angle,
          scaleX: f_img.scaleX,
          scaleY: f_img.scaleY,
          fill: "grey",
          opacity: .6,
          lockRotation: true
        });
        this.stage.add(this.cropping_rect);
        this.stage.setActiveObject(this.cropping_rect);
        event_emitter.on('submenu.apply.crop', function() {
          var crop_bounds, crop_dimensions, crop_height, crop_image, crop_image_bounds, crop_width, crop_x, crop_y, img_angle;
          crop_image = _this.canvas_item.item;
          crop_image_bounds = crop_image.getBoundingRect();
          img_angle = f_img.get('angle');
          crop_bounds = _this.cropping_rect.getBoundingRect();
          crop_x = Math.round(crop_bounds.left - crop_image_bounds.left);
          crop_y = Math.round(crop_bounds.top - crop_image_bounds.top);
          crop_width = Math.round(crop_bounds.width);
          crop_height = Math.round(crop_bounds.height);
          console.log("imag bounds");
          console.log(crop_image_bounds);
          console.log("cropping");
          console.log(crop_image);
          _this.stage.remove(_this.cropping_rect);
          _this.reset_img(crop_image);
          crop_dimensions = {
            x: crop_x,
            y: crop_y,
            width: crop_width,
            height: crop_height
          };
          console.log(crop_dimensions);
          _this.stage.crop(crop_image, crop_dimensions);
          return _this.on_applied();
        });
        return event_emitter.on('submenu.cancel.crop', function() {
          return _this.deactivate();
        });
      };

      CropCommand.prototype.deactivate = function(canvas_item) {
        this.stage.remove(this.cropping_rect);
        this.reset_img(this.canvas_item.item);
        this.stage.renderAll();
        return this.on_deactivate();
      };

      return CropCommand;

    })();
  });

}).call(this);
