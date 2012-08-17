
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.rotation = function(req,res){
	res.render('rotate',{title:'Rotation'})
}