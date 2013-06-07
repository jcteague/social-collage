(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['require', 'jquery', 'underscore', 'EventEmitter'], function(require, $, _, event_emitter) {
    var ToolBar;
    return ToolBar = (function() {
      function ToolBar(toolbar, default_command) {
        this.applyCommand = __bind(this.applyCommand, this);
        this.on_publish_click = __bind(this.on_publish_click, this);
        this.on_toolbar_item_click = __bind(this.on_toolbar_item_click, this);
        var _this = this;
        this.edit_toolbar = $('#edit-toolbar');
        this.toolbar = $(toolbar).find('#collage-menu-list');
        this.publishBtn = $('#publish');
        this.publish_toolbar = $('#publish-toolbar');
        this.publishBtn.click(this.on_publish_click);
        this.menu_items = {};
        this.toolbar.find('li').each(function(idx, item) {
          var command_name, li;
          li = $(item);
          command_name = li.data("commandname");
          return require(["ToolbarItem-" + command_name], function(ToolbarItem) {
            var menu_item;
            menu_item = new ToolbarItem(_this);
            return _this.menu_items[command_name] = menu_item;
          });
        });
        this.toolbar_items = this.toolbar.find('li');
        event_emitter.on("ItemSelected", function(selected_item) {
          return _this.selected_canvas_item = selected_item;
        });
        event_emitter.on("ItemDeSelected", function() {
          var _ref;
          console.log("toolbar ItemDelected:");
          if ((_ref = _this.current_command) != null) {
            _ref.unbind(_this.selected_canvas_item);
          }
        });
        this.toolbar_items.find('a').click(this.on_toolbar_item_click);
      }

      ToolBar.prototype.hide_menu = function() {
        return this.toolbar.find('a').hide();
      };

      ToolBar.prototype.show_menu = function() {
        return this.toolbar.find('a').show();
      };

      ToolBar.prototype.on_toolbar_item_click = function(evt, ui) {
        var command_name, menu_item, previous_menu_item;
        menu_item = $(evt.currentTarget).parent();
        command_name = menu_item.data('commandname');
        console.log("selected action: " + command_name);
        previous_menu_item = this.current_menu_item;
        this.current_menu_item = this.menu_items[command_name];
        return this.current_menu_item.activate(this.selected_canvas_item);
      };

      ToolBar.prototype.on_publish_click = function(evt) {
        console.log("publish click");
        return event_emitter.emit("PublishCollageClicked");
      };

      ToolBar.prototype.set_initial_active = function() {
        var active_item, i, _i, _len, _ref;
        _ref = this.toolbar_items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if ($(i).hasClass('active')) {
            active_item = $(i);
          }
        }
        if (active_item == null) {
          active_item = this.toolbar_items[0];
        }
        return this.set_active(active_item);
      };

      ToolBar.prototype.applyCommand = function(item) {};

      return ToolBar;

    })();
  });

}).call(this);
