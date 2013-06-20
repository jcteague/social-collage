// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define("ToolbarItem-border", ["ToolbarItem", "BorderCommand", "BorderSubMenu"], function(ToolbarItem, BorderCommand, SubMenu) {
    var RemoveToolbarItem;
    return RemoveToolbarItem = (function(_super) {

      __extends(RemoveToolbarItem, _super);

      function RemoveToolbarItem(toolbar) {
        this.toolbar = toolbar;
        RemoveToolbarItem.__super__.constructor.call(this, this.toolbar);
        this.submenu = new SubMenu();
        this.command = new BorderCommand(this.submenu, this.hide_submenu, this.hide_submenu);
      }

      return RemoveToolbarItem;

    })(ToolbarItem);
  });

}).call(this);
