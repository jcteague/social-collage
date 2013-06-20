
/**
 * Module dependencies.
 */

var express = require('express')
  , request = require('request')
  , http = require('http')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , FaceBookStrategy = require('passport-facebook').Strategy
  , UserService = require('./src/User')
  , routes = require('./routes')
  , config = require('./src/configuration');

var FB_API_KEY = '236634053108854';
var FB_APP_SECRET = 'fcd97617bb0528ea89206b905dd02b68';

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

var app = module.exports = express.createServer();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Configuration
passport.use(new FaceBookStrategy(
  {
    clientID: config.facebook_app_key,
    clientSecret: config.facebook_app_secret,
    callbackURL: config.host_name+"/auth/facebook/callback"
  },function(accessToken,refreshToken, profile, done){
    console.log("facebook auth");
    console.log(accessToken);
    console.log(profile);
    var userService = new UserService();
    userService.registerWithFacebook(profile, function(error, user){
      console.log("registering user");
      if(error){
        console.log("error registiering user");
        console.log(error);
        return;
      }
      user.accessToken = accessToken
      return done(null, user);
    })
    
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
  app.use(express.logger())
  mongoose.connect(config.mongodb_connection_string);
   
});

app.configure('production', function(){
  app.use(express.errorHandler());
  mongoose.connect(config.mongodb_connection_string);
  
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
    console.log("face book callback");
    res.redirect('/collages')
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
app.get('/collages',ensureAuthenticated, routes.userCollages)
//change the route to just post: /collage
app.post('/create',ensureAuthenticated, routes.create);
app.post('/photo',ensureAuthenticated, routes.savePhoto);
app.get('/collage/:id',ensureAuthenticated,routes.collage);


app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  console.log(app.address());
});
