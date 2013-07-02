var CollageService = require("../src/collage");
var UserService = require("../src/User");

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
	console.log(req);
	collageService.create(req.user,req.body.collageName,function(error,result){
		res.redirect('/collage/'+result._id);
	})
	
}
exports.collage = function(req, res){
	res.render('collage',{locals:{id:req.params.id}});
}

exports.userCollages = function(req,res){
	console.log("user collages");
	console.log(req.user);
	userService.getCollages(req.user)
		.exists('photo_url')
		.exec(function(error, result){
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

	photos.save(photo_data.photoId, photo_data.imageContent, function(error, photoUrl){
		// console.log(res);
		collageService.update(photo_data.photoId,{photo_url:photoUrl}, function(error,result){
			if(error){
				console.log(error);
				res.send(500,error)
				return;
			}
			res.json({url:photoUrl});
		})
		

	});

}

exports.publish = function(req,res){
	console.log(req.body);
	var collage_id = req.params.id;
	var service = req.body.service;
	var identifier = req.body.identifier;
	update_data = {
		published:true,
		published_photo:{
			service: service,
			identifier: identifier
		}
	};
	collageService.update(collage_id,update_data,function(error,result){
		if(error){
			console.log(error);
			res.send(500,error)
			return;
		}
		res.json({success:true})
	})

	

};