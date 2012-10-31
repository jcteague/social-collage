(function() {
  var ToolBar;

  App.ToolBar = ToolBar = (function() {

    function ToolBar(items_class_selector) {
      var toolbar_items,
        _this = this;
      toolbar_items = $(items_class_selector);
      this.set_initial_active();
      this.toolbar_items.click(function(evt, ui) {
        var command_name;
        command_name = $(evt.currentTarget).data('action');
        console.log("#command clicked: " + command_name);
        _this.set_active($(evt.currentTarget));
        return app.event_emitter.emit('Toolbar.MenuItemSelected', command_name);
      });
    }

    ToolBar.prototype.set_active = function(toolbar_item) {
      toolbar_item.addClass('active');
      if (this.active != null) this.active.removeClass('active');
      return this.active = toolbar_item;
    };

    ToolBar.prototype.set_initial_active = function() {
      var active_item, i, _i, _len, _ref;
      _ref = this.toolbar_items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if ($(i).hasClass('active')) active_item = $(i);
      }
      if (active_item == null) active_item = this.toolbar_items[0];
      return this.set_active(active_item);
    };

    return ToolBar;

  })();

}).call(this);
