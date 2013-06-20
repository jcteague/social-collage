// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['require', 'jquery', 'EventEmitter'], function(require, $, event_emitter) {
    var ToolbarItem;
    return ToolbarItem = (function() {

      function ToolbarItem(toolbar) {
        this.toolbar = toolbar;
        this.hide_submenu = __bind(this.hide_submenu, this);

        this.show_submenu = __bind(this.show_submenu, this);

      }

      ToolbarItem.prototype.show_submenu = function() {
        if (this.submenu) {
          this.toolbar.hide_menu();
          return this.submenu.show();
        }
      };

      ToolbarItem.prototype.hide_submenu = function() {
        if (this.submenu) {
          this.submenu.hide();
          return this.toolbar.show_menu();
        }
      };

      ToolbarItem.prototype.activate = function(canvas_item) {
        var _this = this;
        this.show_submenu();
        return this.command.activate(canvas_item, function() {
          return _this.hide_submenu();
        });
      };

      ToolbarItem.prototype.deactivate = function(canvas_item) {
        this.hide_submenu();
        return this.command.deactivate();
      };

      return ToolbarItem;

    })();
  });

}).call(this);
