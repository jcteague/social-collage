var config_values = {
	mongodb_connection_string: {
		production: process.env.MONGOHQ_URL,
		development: "mongodb://localhost/collage"
	},
	facebook_app_key: {
		production: '555942874451874',
		development:'555942874451874'
	},
	facebook_app_secret: {
		production:'75b5a3157fe63d119f83d46fe6906c48',
		development:'75b5a3157fe63d119f83d46fe6906c48'
	},

	s3_access_key: {
		production: 'AKIAJBGWKUWN4K44G5HA',
		development: 'AKIAJBGWKUWN4K44G5HA'
	},

	s3_secret_access_key: {
		production: 'SOsTMtns6o7K5P+mZYyHxgw0kkq9IlJhsBt4c+Vo',
		development: 'SOsTMtns6o7K5P+mZYyHxgw0kkq9IlJhsBt4c+Vo'
	},
	s3_upload_bucket: {
		production: 'broowdphotos',
		development: 'broowdphotos_test'
	},
	host_name:{
		production: 'http://broowd.herokuapp.com',
		development: 'http://localhost:5000'
	}
	


}

var set = function(key){
	console.log("setting config keys");
	env = process.env.NODE_ENV
	console.log(env);
	return config_values[key][env]
}

for(k in config_values){
	exports[k] = set(k)
}
console.log(exports)
