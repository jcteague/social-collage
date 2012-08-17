(function() {
  var fields, klass, p;

  klass = {
    a: 1,
    b: 2,
    c: 3
  };

  fields = (function() {
    var _results;
    _results = [];
    for (p in klass) {
      _results.push(p);
    }
    return _results;
  })();

  console.log(fields);

}).call(this);
