(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'EventEmitter', 'SubMenu'], function($, event_emitter, SubMenu) {
    var BorderSubMenu;
    return BorderSubMenu = (function(_super) {
      __extends(BorderSubMenu, _super);

      function BorderSubMenu() {
        this.setBorderColor = __bind(this.setBorderColor, this);
        this.setBorderWidth = __bind(this.setBorderWidth, this);
        var _this = this;
        BorderSubMenu.__super__.constructor.call(this, '#border-submenu');
        this.border_size = $('#border-size');
        this.border_color = $('#border-color-picker').colorpicker();
        this.border_size.on("blur", function(evt) {
          var size;
          console.log("size blur");
          size = $(evt.currentTarget).val();
          console.log(size);
          return event_emitter.emit("submenu.border.widthSet", {
            borderSize: size
          });
        });
        this.border_color.on("changeColor", function(ev) {
          console.log("border color change");
          return event_emitter.emit("submenu.border.colorSet", {
            color: ev.color.toRGB()
          });
        });
        $('#border-apply').on('click', function(evt) {
          return event_emitter.emit("submenu.apply.border");
        });
        $('#border-cancel').on('click', function(evt) {
          return event_emitter.emit("submenu.cancel.border");
        });
      }

      BorderSubMenu.prototype.setBorderWidth = function(width) {
        console.log("border width " + width);
        return this.border_size.val(width);
      };

      BorderSubMenu.prototype.setBorderColor = function(color) {
        return console.log("border color " + color);
      };

      return BorderSubMenu;

    })(SubMenu);
  });

}).call(this);
