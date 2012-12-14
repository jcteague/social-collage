(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = Array.prototype.slice;

  define(['EventEmitter', 'Collage', 'Commands'], function(event_emitter, Collage, commands) {
    var App;
    return App = (function() {

      function App(canvas_element) {
        this.canvas_element = canvas_element;
        this.onToolbarItemSelected = __bind(this.onToolbarItemSelected, this);
        this.onCanvasItemClick = __bind(this.onCanvasItemClick, this);
        this.collage = new Collage(this.canvas_element);
        this.collageItemClick = commands.resize.action;
        event_emitter.on("ItemSelected", this.onCanvasItemClick);
        event_emitter.on("Toolbar.MenuItemSelected", this.onToolbarItemSelected);
      }

      App.prototype.setToolbarAction = function(action) {
        this.toolbarAction = action;
        return this.event_emitter.emit("toolbar-action-selected", action);
      };

      App.prototype.emit = function() {
        var event_name, event_parameters;
        event_name = arguments[0], event_parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return this.event_emmitter.emit(event_name, event_parameters);
      };

      App.prototype.onCanvasItemClick = function(item_type, item) {
        console.log("oncanvas click event " + item_type + " item type");
        return this.collageItemClick(item);
      };

      App.prototype.onToolbarItemSelected = function(command) {};

      return App;

    })();
  });

}).call(this);
