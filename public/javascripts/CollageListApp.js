// Generated by CoffeeScript 1.4.0
(function() {

  define(['jquery', 'bootstrap', 'CollageList', 'EventEmitter', 'CollagePublishDialog'], function($, bootstrap, CollageList, event_emitter, CollagePublishDialog) {
    return $(function() {
      var collage_list, publish_dialog;
      console.log("collagelist app startup");
      collage_list = new CollageList();
      return publish_dialog = new CollagePublishDialog();
    });
  });

}).call(this);
