(function() {
  define(["CropCommand", "CropSubMenu"], function(crop, cropSubMenu) {
    return {
      'crop': {
        command: crop,
        submenu: cropSubMenu
      }
    };
  });

}).call(this);
