var factory = require("./factories");
var sandbox = require('sandboxed-module');
var sinon = require('sinon');

var response = sinon.stub();
var collage = require('../src/collage');
var test_collage = {_id:"collageid"}
// var collage_stub = sinon.stub(collage,'create').yields([null,test_collage]);

// var route = sandbox.require('../routes/index',{
// 	requires:{"../src/collage": collage_stub}
// });


// describe("Create Collage Route:",function(){
// 	var test_user;
// 	beforeEach(function(done){
		
// 			test_user = {
// 				_id: 'testid'
// 			};
// 			done();
		
// 	})	
// 	it("should create a new collage for the logged in user",function(done){
// 		var request = {
// 			body:{
// 				collageName:"Test Collage"

// 			},
// 			user:test_user
// 		};
// 		var response  = {
// 			render: sinon.spy()
			
// 		}
// 		route.create(request,response);


		

// 	});

// 	it("should return the collage in the response");
// })