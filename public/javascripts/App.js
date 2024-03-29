// Generated by CoffeeScript 1.4.0
(function() {

  define(['EventEmitter', 'Collage', 'Toolbar', 'PhotoGallery', 'PublishDialog'], function(event_emitter, Collage, Toolbar, photoGallery, publishDialog) {
    var App;
    return App = (function() {

      function App(canvas_element) {
        var _this = this;
        this.canvas_element = canvas_element;
        this.collage = new Collage(this.canvas_element);
        this.toolbar = new Toolbar();
        event_emitter.on("canvas:mousemove", function(evt) {
          $('#canvas-mouse-x').text(evt.x);
          return $('#canvas-mouse-y').text(evt.y);
        });
        event_emitter.on("ShowPublishDialogClicked", function() {
          return publishDialog(_this.collage);
        });
      }

      return App;

    })();
  });

}).call(this);
