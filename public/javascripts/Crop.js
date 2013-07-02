// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  require(['jquery', 'fabric'], function($, fabric) {
    var Crop;
    Crop = (function() {

      function Crop(canvas) {
        this.canvas = canvas;
        this.constrain_box_size = __bind(this.constrain_box_size, this);

        this.selected_element = this.canvas.getActiveObject();
        console.log(this.selected_element);
        this.crop_box = this.create_cropping_box();
      }

      Crop.prototype.constrain_box_size = function(evt) {
        var box_bounds, photo_bounds;
        box_bounds = evt.target.getBoundingRect();
        photo_bounds = this.selected_element.getBoundingRect();
        if (box_bounds.left < photo_bounds.left) {
          console.log("moved past picture left");
          return this.evt.target.set('lockScalingX', true);
        }
      };

      Crop.prototype.crop = function() {
        var crop_bounds, crop_height, crop_width, crop_x, crop_y, ctx, img, img_bounds;
        console.log("cropping");
        this.selected_element.set('angle', 0);
        this.crop_box.set('angle', 0);
        this.stage.renderAll();
        ctx = this.canvas.getContext();
        img = this.selected_element._element;
        img_bounds = this.selected_element.getBoundingRect();
        crop_bounds = this.crop_box.getBoundingRect();
        crop_x = Math.round(crop_bounds.left - img_bounds.left);
        crop_y = Math.round(crop_bounds.top - img_bounds.top);
        crop_width = crop_bounds.width;
        crop_height = crop_bounds.height;
        console.log("" + crop_x + ", " + crop_y + "," + crop_width + ", " + crop_height);
        console.log("cropping bounds");
        this.canvas.remove(this.crop_box);
        this.canvas.crop(this.selected_element, crop_x, crop_y, crop_width, crop_height);
        return this.selected_element.set('hasControls', true);
      };

      Crop.prototype.create_cropping_box = function() {
        var cropping_rect;
        cropping_rect = new fabric.Rect({
          top: this.selected_element.top,
          left: this.selected_element.left,
          width: this.selected_element.width,
          height: this.selected_element.height,
          angle: this.selected_element.angle,
          fill: "grey",
          opacity: .45,
          lockRotation: true
        });
        this.canvas.add(cropping_rect);
        this.selected_element.set('hasControls', false);
        return cropping_rect;
      };

      return Crop;

    })();
    return $(function() {
      var cropper, f_cnvs, f_img, img;
      console.log("crop test setup");
      f_cnvs = new fabric.Canvas("cnvs");
      img = document.getElementById("pic");
      f_img = new fabric.Image(img, {
        left: 600,
        top: 400,
        angle: 0
      });
      f_cnvs.add(f_img);
      cropper = {};
      $('#add-crop').click(function() {
        return cropper = new Crop(f_cnvs);
      });
      return $('#crop').click(function() {
        return cropper.crop();
      });
    });
  });

}).call(this);
