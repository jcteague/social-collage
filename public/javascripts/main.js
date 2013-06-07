(function() {
  requirejs.config({
    paths: {
      "jquery": "jquery-1.7.2.min",
      "underscore": "underscore-min",
      "jqueryUI": "jqueryui-min",
      "bootstrap": "bootstrap",
      "EventEmitter2": "eventemitter2",
      "async": "async",
      "fabric": "fabric",
      "sylvester": "sylvester",
      "wijmoUtil": "jquery.wijmo.wijutil.min",
      "wijmoSplitter": "jquery.wijmo.wijsplitter.min",
      "ColorPicker": "bootstrap-colorpicker",
      "ToolbarItem-remove": "RemoveToolbarItem",
      "ToolbarItem-crop": "CropToolbarItem",
      "ToolbarItem-border": "BorderToolbarItem",
      "ToolbarItem-shadow": "ShadowToolbarItem"
    },
    shim: {
      underscore: {
        exports: '_'
      },
      fabric: {
        exports: 'fabric'
      },
      jqueryUI: {
        exports: '$',
        deps: ['jquery']
      },
      EventEmitter2: {
        exports: "EventEmitter2"
      },
      async: {
        exports: "async"
      },
      wijmoUtil: {
        exports: "wijmoUtil",
        deps: ["jquery"]
      },
      wijmoSplitter: {
        exports: "wijmoSplitter",
        deps: ["jqueryUI", "wijmoUtil"]
      },
      ColorPicker: {
        exports: "ColorPicker",
        deps: ["jquery", "bootstrap"]
      }
    }
  });

  require(['jquery', 'ColorPicker', 'UserPhotos', 'App'], function($, ColorPicker, UserPhotos, App) {
    return $(function() {
      var app, userPhotos;
      userPhotos = new UserPhotos();
      app = new App('collage-canvas');
      console.log("loading dependencies");
      $('.color').colorpicker();
      return $('#logout').click(function() {
        return FB.logout();
      });
    });
  });

}).call(this);
