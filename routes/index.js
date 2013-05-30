
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log(req.user);
  res.render('index', { title: 'Express' })
};

exports.create = function(req,res){
	res.render('collage')
}