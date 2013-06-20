var mongoose = require("mongoose");
var schemas = require("./schemas");
var collage = require("./collage");

module.exports = User;

function User(){
	this._model = schemas.User;
};


	

User.prototype.create = function(user_data, callback){
	console.log("creating user");
	var model = new this._model(user_data);
	model.save(function(error,result){
		console.log("saving user callback");
		
		if(error){
		
			console.log(error)
			callback(error,null);
			return;
		}
		callback(null,result);
	}) 
};

User.prototype.registerWithFacebook = function(facebook_profile, callback){
	console.log("registering facebook user");
	profile = facebook_profile._json;
	var that = this;
	this._model.findOne({email:profile.email},function(err,result){
		console.log("looking up by email");
		console.log(result);
		if(err){
			console.log(err);
			callback(err,null);
			return;
		}
		if(result){
			console.log("user found");
			callback(null,result);
		}
		else{
			that.create({
				first_name: profile.first_name,
				last_name: profile.last_name,
				email: profile.email,
				facebook_id: profile.id
			}, callback);
			
			
		}

	})
};

User.prototype.getUser = function(id,callback){
	this._model.findById(id,function(error,result){
		if(error){
			console.log(error);
			callback(error,null);
			return;
		}
		callback(null,result);

	})
}

User.prototype.getCollages = function(user,callback){
	callback(null,null);
}
	

