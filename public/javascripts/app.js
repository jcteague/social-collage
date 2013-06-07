(function() {
  define(['EventEmitter', 'Collage', 'Toolbar', 'PhotoGallery'], function(event_emitter, Collage, Toolbar, photoGallery) {
    var App;
    return App = (function() {
      function App(canvas_element) {
        var diagnostics;
        this.canvas_element = canvas_element;
        this.collage = new Collage(this.canvas_element);
        this.toolbar = new Toolbar('#collage-menu-list');
        diagnostics = $('<div>', {
          id: "diagnostics"
        });
        diagnostics.append("<h3>diagnostics</h3>\n<div>\n	<span>canvas mouse: x: <span id=\"canvas-mouse-x\"></span>,y:<span id=\"canvas-mouse-y\"></span></span>\n</div>");
        $('body').append(diagnostics);
        event_emitter.on("canvas:mousemove", function(evt) {
          $('#canvas-mouse-x').text(evt.x);
          return $('#canvas-mouse-y').text(evt.y);
        });
      }

      return App;

    })();
  });

}).call(this);
