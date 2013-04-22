// Generated by CoffeeScript 1.4.0
(function() {

  define(['EventEmitter', 'Collage', 'Toolbar', 'Commands'], function(event_emitter, Collage, Toolbar, commands) {
    var App;
    return App = (function() {

      function App(canvas_element) {
        this.canvas_element = canvas_element;
        this.collage = new Collage(this.canvas_element);
        this.toolbar = new Toolbar('#collage-menu-list .menu-item', "move");
      }

      return App;

    })();
  });

}).call(this);
