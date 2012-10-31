(function() {
  var App,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = Array.prototype.slice;

  requirejs.config({
    
    paths: {
      "jquery": "../jquery-1.7.2.min",
      "underscore": "../underscore-min",
      "jqueryUI": "../jqueryui-min",
      "bootstrap": "../bootstrap",
      "eventEmitter": "../eventemitter2",
      "kinetic": "../kinetic-min",
      "sylvester": "../sylvester"
    },
    shim: {
      'kinetic': {
        exports: "kinetic"
      }
    }
  });

  require(['jquery', 'kinetic', 'underscore'], function($, k, _) {
    console.log($);
    console.log(k);
    return console.log(_);
  });

  App = (function() {

    function App(canvas_element, event_emitter) {
      this.canvas_element = canvas_element;
      this.event_emitter = event_emitter;
      this.onToolbarItemSelected = __bind(this.onToolbarItemSelected, this);
      this.onCanvasItemClick = __bind(this.onCanvasItemClick, this);
      this.collage = new App.Collage(this.canvas_element, this.event_emitter);
      this.collageItemClick = App.Commands.Resize.action;
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
      console.log("" + item_type + " clicked");
      return this.collageItemClick(item);
    };

    App.prototype.onToolbarItemSelected = function(command) {
      return this.collageItemClick = App.Commands[command].action;
    };

    return App;

  })();

}).call(this);
