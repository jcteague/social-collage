(function() {
  define(["fabric", "EventEmitter"], function(fabric, event_emitter) {
    var ShadowCommand;
    return ShadowCommand = (function() {
      function ShadowCommand(on_deactivate) {
        this.on_deactivate = on_deactivate;
      }

      ShadowCommand.prototype.activate = function(collage_item) {
        var item, shadow, stage;
        this.collage_item = collage_item;
        stage = this.collage_item.stage;
        item = this.collage_item.item;
        shadow = {
          color: "rgba(0,0,0,0.5)",
          offsetX: 10,
          offsetY: 10,
          blur: 20,
          affectStroke: true
        };
        item.setShadow(shadow);
        return stage.renderAll();
      };

      ShadowCommand.prototype.deactivate = function(collage_item) {
        this.collage_item = collage_item;
      };

      return ShadowCommand;

    })();
  });

}).call(this);
