
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.requirejs = function(req,res){
	res.render('requirejs',{title:'requirejs',layout:false})
}