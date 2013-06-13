var should = require("should");
var photos = require("../src/photo");
var fs = require("fs");
var test_data = require("./TestPhotoData").photo_data;
describe("processing photos: ",function(){
	var test_file_path = process.cwd()+'/test/test_photo';
	var expected_filename = test_file_path+".png";
	describe("when saving a photo",function(){

		afterEach(function(done){
			fs.unlink(expected_filename,function(){
				done();
			})
		})
		it("should save the file at the given location",function(done){
			
			photos.save( test_file_path,test_data,function(error){
				fs.exists(expected_filename,function(exists){
					exists.should.be.ok;
					done();
				})
				
			})
		})
	})

})