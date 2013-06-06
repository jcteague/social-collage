var CollageService = require("../src/collage");
var UserService = require("../src/user");
var userService = new UserService();
var collageService = new CollageService();

/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log("index route");
  console.log(req.user);
  res.render('index', { title: 'Express' })
};

exports.create = function(req,res){
	console.log("create route");
	collageService.create(req.user,req.body.name,function(error,result){
		console.log("collage.create callback");
		
		res.redirect('/collage/'+result._id);
	})
	
}
exports.collage = function(req, res){
	res.render('collage');
}

exports.userCollages = function(req,res){
	console.log("user collages");
	console.log(req.user);
	userService.getCollages(req.user,function(error, result){
		//TODO: handle errors;
		if(error){
			console.log(error);
			return;
		}
		res.render('mycollages',{collages: result});	
	});

}