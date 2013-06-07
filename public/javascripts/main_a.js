(function() {
  var fb_photo_dropped;

  $(function() {
    var collage_toolbar, rotateSlider;
    window.emitter = new EventEmitter2();
    window.app = new App('canvas-container', emitter);
    collage_toolbar = new App.ToolBar('#collage-menu-list .menu-item');
    $('#login').click(facebookLogin);
    $('#logout').click(function() {
      return FB.logout();
    });
    $('#canvas-container canvas').droppable({
      drop: fb_photo_dropped
    }).css({
      border: 'solid black 1px'
    });
    return rotateSlider = new RotateSlider('sub-menu', window.emitter);
  });

  fb_photo_dropped = function(evt, ui) {
    var img, img_data;
    console.log("photo image dropped");
    console.dir(evt);
    console.dir(ui);
    img = $(ui.draggable);
    img_data = {
      offsetX: evt.offsetX,
      offsetY: evt.offsetY,
      fbData: img.data('fb_data')
    };
    console.log(img_data);
    return app.collage.addFbPhoto(img_data);
  };

}).call(this);
