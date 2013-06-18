require("should");
var sinon = require("sinon");
var UserService = require('../src/user');
var user = new UserService();
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/collage");
mongoose.connection.on('error', function() {});


describe("User",function(){
	describe("When Logging in From Facebook",function(){
		var facebook_profile = { 
			provider: 'facebook',
		  id: '1033388946',
		  username: 'jcteague',
		  displayName: 'John Teague',
		  name: 
		   { familyName: 'Teague',
		     givenName: 'John',
		     middleName: undefined },
		  gender: 'male',
		  profileUrl: 'http://www.facebook.com/jcteague',
		  emails: [ { value: 'jcteague@gmail.com' } ],
		  _raw: '{"id":"1033388946","name":"John Teague","first_name":"John","last_name":"Teague","link":"http:\\/\\/www.facebook.com\\/jcteague","username":"jcteague","hometown":{"id":"104044239632115","name":"Batesville, Arkansas"},"location":{"id":"106224666074625","name":"Austin, Texas"},"gender":"male","email":"jcteague\\u0040gmail.com","timezone":-5,"locale":"en_US","verified":true,"updated_time":"2012-07-08T18:02:24+0000"}',
		  _json: 
		   { id: 1033388946,
		     name: 'John Teague',
		     first_name: 'John',
		     last_name: 'Teague',
		     link: 'http://www.facebook.com/jcteague',
		     username: 'jcteague',
		     hometown: { id: '104044239632115', name: 'Batesville, Arkansas' },
		     location: { id: '106224666074625', name: 'Austin, Texas' },
		     gender: 'male',
		     email: 'jcteague@gmail.com',
		     timezone: -5,
		     locale: 'en_US',
		     verified: true,
		     updated_time: '2012-07-08T18:02:24+0000' } 
		  }
		// console.log(mongoose);
		
		beforeEach(function(done){
			
			user._model.collection.drop();	
			done();

		})
		afterEach(function(done){
			user._model.collection.drop();
			done();
		})


		it("should create the user if the user does not exist", function(done){
			
			user.registerWithFacebook(facebook_profile,function(error, result){
				
				result._id.should.exist;
				result.facebook_id.should.equal(facebook_profile._json.id);
				done();
			})

		});

		it("should return the user if the user does exist",function(done){
			var test_user = user._model({
				first_name:'john',
				last_name:'teague',
				email:'jcteague@gmail.com',
				facebook_id: 123456789

			});
			test_user.save(function(err,result){

					user.registerWithFacebook(facebook_profile,function(error, the_user){
						the_user._id.toString().should.equal(result._id.toString());
						done();

					})
			})
		})
	})
})