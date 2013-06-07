(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'EventEmitter', 'SubMenu'], function($, event_emitter, SubMenu) {
    var CropSubMenu;
    return CropSubMenu = (function(_super) {
      __extends(CropSubMenu, _super);

      function CropSubMenu(top_menu, on_close) {
        CropSubMenu.__super__.constructor.call(this, '#crop-submenu');
        $('#crop-submenu').on('click', '#crop-apply', function(evt, ui) {
          var event_name;
          event_name = $(this).data('event');
          console.log("crop submenu " + event_name);
          return event_emitter.emit(event_name);
        });
        $('#crop-submenu').on('click', '#crop-cancel', function(evt, ui) {
          var event_name;
          event_name = $(this).data('event');
          console.log("crop submenu " + event_name);
          return event_emitter.emit(event_name);
        });
      }

      return CropSubMenu;

    })(SubMenu);
  });

}).call(this);
