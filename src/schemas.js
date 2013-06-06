var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Types = mongoose.Types;


module.exports.userSchema = new Schema({
		// id: Number,
		first_name: {type:String, required:true},
		last_name: {type:String, required:true},
		email: {type:String, index:{unique:true, required:true}},
		facebook_id: Number,
		collages: [{type:Schema.ObjectId,ref:"Collage"}]
	})


	
module.exports.collageSchema = new Schema({
			name: String,
			user_id: { type: Schema.ObjectId, ref: 'User' },
			photo_url: String

	});
module.exports.User = mongoose.model('User', module.exports.userSchema);
module.exports.Collage = mongoose.model('Collage', module.exports.collageSchema);



