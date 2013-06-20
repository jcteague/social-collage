var mongoose = require("mongoose");
var schemas = require('./schemas');
var UserService = require('./User');

module.exports = Collage;

function Collage(){
	
	this._model = schemas.Collage;
}
Collage.prototype.create = function(user, collage_name,callback){
	console.log("collage.create");
	var UsrSrvc = require('./user');
	var user_service = new UsrSrvc();
	var collage = new this._model({
		name: collage_name,
		user_id: user._id
	});
	
	user_service.getUser(user._id,function(error, user_result){
		
		if(error){
			console.log(error);
			callback(error,null);
			return;
		}

		collage.save( function(error, collage_result){
			
			if(error){
				console.log(error);
				callback(error,null);
				return;
			}
			user_result.collages.push(collage_result);
			user.collages = user_result.collages;
			user_result.save(function(error, user_result){
			
				if(error){
					console.log(error);
					callback(error, null);
					return;
				}
				
				console.log(user);
				callback(null,collage_result);
			})
		})
	})
};

Collage.prototype.update = function(id, values, callback){
	console.log("udpating");
	this._model.update({_id: id}, values,function(error,result){
		if(error){
			console.log(error);
			callback(error,callback);
			return;
		}
		console.log("update result");
		console.log(result);
		callback(null, result)
	})
}
	   



