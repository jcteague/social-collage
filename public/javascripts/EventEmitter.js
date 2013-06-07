(function() {
  define(['EventEmitter2'], function(Em) {
    var getInstance;
    getInstance = function() {
      var em;
      if (!em) {
        console.log("initializing event emitter");
        em = new Em();
      }
      return em;
    };
    return getInstance();
  });

}).call(this);
