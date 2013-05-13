// Generated by CoffeeScript 1.4.0
(function() {

  define(["fabric", "EventEmitter"], function(fabric, event_emitter) {
    var RemoveCommand;
    return RemoveCommand = (function() {

      function RemoveCommand(on_applied, on_deactivate) {
        this.on_applied = on_applied;
        this.on_deactivate = on_deactivate;
      }

      RemoveCommand.prototype.activate = function(collage_item) {
        var stage;
        this.collage_item = collage_item;
        stage = this.collage_item.stage;
        stage.remove(collage_item.item);
        event_emitter.emit("ItemRemoved", this.collage_item);
        return this.on_applied();
      };

      RemoveCommand.prototype.deactivate = function(collage_item) {
        this.collage_item = collage_item;
        return this.on_deactivate();
      };

      return RemoveCommand;

    })();
  });

}).call(this);
