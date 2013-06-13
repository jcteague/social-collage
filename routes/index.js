var CollageService = require("../src/collage");
var UserService = require("../src/user");

var userService = new UserService();
var photos = require("../src/photo");
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
	res.render('collage',{locals:{id:req.params.id}});
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

exports.savePhoto = function(req,res){
	photo_data = req.body;

	var base_path = "public/images/user_content";
	
	photos.save(base_path, photo_data.photoId, photo_data.imageContent, function(error, filename){
		// console.log(res);
		console.log(req.headers);
		img_url = [req.headers.origin, base_path, filename].join("/");
		res.json({url:img_url});

	});

}