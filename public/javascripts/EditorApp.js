// Generated by CoffeeScript 1.4.0
(function() {

  define(['jquery', 'App', 'ColorPicker'], function($, App) {
    console.log("editor app loaded");
    return $(function() {
      var app;
      app = new App('collage-canvas');
      console.log("loading dependencies");
      return $('.color').colorpicker();
    });
  });

}).call(this);
