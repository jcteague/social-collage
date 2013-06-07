(function() {
  define(['jquery', 'EventEmitter'], function($, event_emitter) {
    var display;
    return display = function(collage) {
      var img;
      img = document.getElementById("collage-preview");
      img.src = collage.getPreviewImage();
      return $('#publishModal').modal('show');
    };
  });

}).call(this);
