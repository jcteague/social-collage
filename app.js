
/**
 * Module dependencies.
 */

var express = require('express')
  , request = require('request')
  , http = require('http')
  , passport = require('passport')
  , FaceBookStrategy = require('passport-facebook').Strategy
  , routes = require('./routes');

var FB_API_KEY = '236634053108854';
var FB_APP_SECRET = 'fcd97617bb0528ea89206b905dd02b68';

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

var app = module.exports = express.createServer();

passport.serializeUser(function(user, done) {
  console.log("serializing user");
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("deserializing user");
  console.log(obj);
  done(null, obj);
});


// Configuration
passport.use(new FaceBookStrategy(
  {
    clientID: FB_API_KEY,
    clientSecret: FB_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },function(accessToken,refreshToken, profile, done){
    console.log("facebook auth");
    console.log(accessToken);
    console.log(profile);
    return done(null, profile);
  }
));

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret:"terces"}));
  app.use(passport.initialize());
  app.use(passport.session());
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

//auth
app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req,res){}
  )
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {failureRedirect: '/login'}),
  function(req,res){
    
    res.redirect('/')
  }

);
//login  
app.get('/login', function(req,res){
  
  res.render('login',{title:'login'})
});

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/')
})

app.get('/', routes.index);
app.get('/images', function(req, res,next){
  var src = req.query.src;
  request.get(req.query.src).pipe(res)
});

app.get('/create',ensureAuthenticated, routes.create);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
