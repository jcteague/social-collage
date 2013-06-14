// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['fabric', 'EventEmitter'], function(fabric, event_emitter) {
    var BorderCommand;
    return BorderCommand = (function() {

      function BorderCommand(menu, on_applied, on_deactivate) {
        this.menu = menu;
        this.on_applied = on_applied;
        this.on_deactivate = on_deactivate;
        this.remove_border = __bind(this.remove_border, this);

      }

      BorderCommand.prototype.activate = function(canvas_item) {
        var f_item,
          _this = this;
        this.canvas_item = canvas_item;
        f_item = this.canvas_item.item;
        this.original_border = {
          strokWidth: f_item.get('strokeWidth', f_item.get('stroke'))
        };
        this.menu.setBorderWidth(f_item.get('strokeWidth'));
        this.menu.setBorderColor(f_item.get('stroke'));
        event_emitter.on("submenu.border.widthSet", function(evt) {
          _this.canvas_item.item.set("strokeWidth", evt.borderSize);
          return _this.canvas_item.stage.renderAll();
        });
        event_emitter.on("submenu.border.colorSet", function(evt) {
          var rgb;
          rgb = "rgba(" + evt.color.r + "," + evt.color.g + "," + evt.color.b + "," + evt.color.a + ")";
          console.log(rgb);
          _this.canvas_item.item.set("stroke", rgb);
          return _this.canvas_item.stage.renderAll();
        });
        event_emitter.on('submenu.apply.border', function() {
          return _this.on_applied();
        });
        return event_emitter.on('submenu.cancel.border', function() {
          return _this.deactivate();
        });
      };

      BorderCommand.prototype.deactivate = function() {
        this.remove_border();
        return this.on_deactivate();
      };

      BorderCommand.prototype.remove_border = function() {
        this.canvas_item.item.set(this.original_border);
        return this.canvas_item.stage.renderAll();
      };

      return BorderCommand;

    })();
  });

}).call(this);