var config_values = {
	mongodb_connection_string: {
		production: process.env.MONGOHQ_URL,
		development: "mongodb://localhost/collage"
	},
	facebook_app_key: {
		production: '236634053108854',
		development:'236634053108854'
	},
	facebook_app_secret: {
		production:'fcd97617bb0528ea89206b905dd02b68',
		development:'fcd97617bb0528ea89206b905dd02b68'
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
