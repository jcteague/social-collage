
/**
 * Module dependencies.
 */

var express = require('express')
  , request = require('request')
  , http = require('http')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
}); 

// Routes

app.get('/', routes.index);
app.get('/images', function(req, res,next){
  var src = req.query.src;
  request.get(req.query.src).pipe(res)
});
app.get('/rotate',routes.rotation)
app.get('/requirejs',routes.requirejs)
app.get('/create',function(qs,rs){
  
})

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
