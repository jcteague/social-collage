require("should");
var sinon = require("sinon");
var SandboxedModule = require("sandboxed-module");
var Faker = require("Faker");
var mongoose = require("mongoose");
var _ = require("underscore");
var UserService = require("../src/User");
var CollageService = require("../src/collage");

mongoose.connect("mongodb://localhost/collage");
mongoose.connection.on('error', function() {});
var test_user, user, collage;
describe("Collage",function(){
	describe("when a user creates a collage",function(){
		
		beforeEach(function(done){
			console.log("before each");
			user = new UserService();
			collage = new CollageService();
			//create the user
			user.create({
				first_name: 'John',
				last_name: 'Teague',
				email: Faker.Internet.email()
			},function(error, result){
				test_user = result;
				done();
			});
		afterEach(function(done){
			user._model.collection.drop();
			collage._model.collection.drop();
			done();

		});

		});
		
		it("should save the collage", function(done){
			collage.create(test_user,"Test Collage",function(error, collage){
				console.log(collage);
				collage._id.should.exist;
				collage.user_id.toString().should.equal(test_user._id.toString());
				done();
			})
		});

		it("should be added to the User's list of collages",function(done){
			collage.create(test_user,"Test Collage",function(error, collage){
				console.log(test_user);
				test_user.collages.should.include(collage._id);
				done();
			});
		});
	});
})


