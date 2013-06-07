(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define("ToolbarItem-crop", ["ToolbarItem", "CropCommand", "CropSubMenu"], function(ToolbarItem, CropCommand, CropSubMenu) {
    var CropToolbarItem;
    return CropToolbarItem = (function(_super) {
      __extends(CropToolbarItem, _super);

      function CropToolbarItem(toolbar) {
        this.toolbar = toolbar;
        CropToolbarItem.__super__.constructor.call(this, this.toolbar);
        this.submenu = new CropSubMenu();
        this.command = new CropCommand(this.hide_submenu, this.hide_submenu);
      }

      return CropToolbarItem;

    })(ToolbarItem);
  });

}).call(this);
