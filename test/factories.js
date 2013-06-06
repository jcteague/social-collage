var Factory = require('factory-lady');
var Faker = require('Faker');
var User = require("../src/user");
var Collage = require("../src/collage");

var emailCounter = 1;
Factory.define('user',User.model, {
	first_name: Faker.Name.firstName(),
	last_name: Faker.Name.lastName(),
	email: Faker.Internet.email(),
	facebook_id: 123456789
});

Factory.define('collage',Collage.model,{
	name:"Test Collage"
})