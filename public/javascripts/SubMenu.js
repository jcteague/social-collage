(function() {
  define(["jquery"], function($) {
    var SubMenu;
    return SubMenu = (function() {
      function SubMenu(selector) {
        this.selector = selector;
      }

      SubMenu.prototype.show = function() {
        return $(this.selector).show();
      };

      SubMenu.prototype.hide = function() {
        return $(this.selector).hide();
      };

      return SubMenu;

    })();
  });

}).call(this);
