var fs = require("fs");
var awsS3 = require("awssum-amazon-s3");
var config = require('./configuration')
var bucketName = config.s3_upload_bucket;

var s3 = new awsS3.S3({
	accessKeyId: config.s3_access_key,
	secretAccessKey:config.s3_secret_access_key,
	region: awsS3.US_EAST_1

});
exports.save = function(filename, content, callback){
	content_parts = content.split(',')
	info_part = content_parts[0];
	image_data = content_parts[1];
	type_start = info_part.indexOf("/")+1;
	type_end = info_part.indexOf(";");
	img_type = info_part.substring(type_start,type_end)
	 
	var buffer = new Buffer(image_data,'base64');
	filename +="." + img_type

	upload_params = {
		BucketName: bucketName,
		ObjectName: filename,
		ContentLength: buffer.length,
		Acl: "public-read",
		Body: buffer
	};
	console.log("uploading");
	s3.PutObject(upload_params,function(error, result){
		
		if(error){
			console.log("error");
			console.log(error);
			callback(error,null);
			return;

		}
		console.log("s3 result");
		console.log(result);
		if(result.StatusCode = 200){
			file_url = "https://"+[s3.host(),bucketName,filename].join("/")
			callback(null,file_url);	
		}
		else{
			callback(new Error(result.Body), null)
		}
		
	})
	// fs.writeFile(file_path,buffer,function(error,result){
	// 	if(error){
	// 		callback(error);
	// 		return;
	// 	}
	// 	callback(null, filename)
	// })
}