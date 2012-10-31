(function() {
  var RotateSlider,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  App.RotateSlider = RotateSlider = (function() {

    function RotateSlider(container, event_emmitter) {
      this.container = container;
      this.event_emmitter = event_emmitter;
      this.onSlide = __bind(this.onSlide, this);
      this.slide_element = $('<div id="rotate-slider" class="slider">').slider({
        min: -180,
        max: 180,
        slide: this.onSlide
      });
      this.rotate_value_element = $('<span id="#rotate-value">').text('0');
      $("#" + this.container).append(this.slide_element).append(this.rotate_value_element);
    }

    RotateSlider.prototype.onSlide = function(evt, ui) {
      console.log("slide");
      this.rotate_value_element.text(ui.value);
      return this.event_emmitter.emit("rotation.changed", ui.value);
    };

    return RotateSlider;

  })();

}).call(this);