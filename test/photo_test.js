var should = require("should");
var photos = require("../src/photo");
var fs = require("fs");
var request = require("request");
var test_data = require("./TestPhotoData").photo_data;
var awsS3 = require("awssum-amazon-s3");
var s3 = new awsS3.S3({
	accessKeyId: "AKIAJBGWKUWN4K44G5HA",
	secretAccessKey:"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",
	region: awsS3.US_EAST_1

})
describe("processing photos: ",function(){
	var test_file_path = process.cwd()+'/test';
	var name = "test_photo"
	var expected_filename = name+".png";
	describe("when saving a photo",function(){

		// beforeEach(
		// 	// function(done){
		// 	// s3.DeleteObject({
		// 	// 	bucket: "broowdphotos_test",
		// 	// 	ObjectName: expected_filename
		// 	// },function(){
		// 	// 	done();
		// 	// })

		// // }
		// )
		it("should save the file to s3",function(done){
			
			photos.save( name, test_data,function(error, result){
				should.not.exist(error);
				console.log("checking s3");
				request({
					url: "https://s3.amazonaws.com/broowdphotos_test/test_photo.png",
					headers:{
						Referer: "http://localhost:3000"
						},
					}
					,function(error, response,body){
						should.not.exist(error);
						response.statusCode.should.equal(200)
						

						done();		
					})
				
			})
		});
		it("should return the url from s3",function(done){
			photos.save(name,test_data,function(error,result){
				should.not.exist(error);
				expected_url = [s3.host(),"broowdphotos_test",expected_filename].join('/')
				result.should.equal(expected_url)
			})
		});//it
	})

})