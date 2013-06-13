var fs = require("fs");

exports.save = function(path,filename, content, callback){
	"data:image/png;base64"
	content_parts = content.split(',')
	info_part = content_parts[0];
	image_data = content_parts[1];
	type_start = info_part.indexOf("/")+1;
	type_end = info_part.indexOf(";");
	img_type = info_part.substring(type_start,type_end)
	 
	var buffer = new Buffer(image_data,'base64');
	filename +="." + img_type
	var file_path = path+"/"+filename;
	console.log("saving image at: " + file_path);
	fs.writeFile(file_path,buffer,function(error,result){
		if(error){
			callback(error);
			return;
		}
		callback(null, filename)
	})
}