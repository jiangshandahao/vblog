var ArticleController = require('../controllers/article_controller.js');

module.exports = function(app){

app.get('/post',checkLogin);
app.get('/post',function(req,res){
	res.render('post', {
		title: '微草帽－写文章',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});
app.post('/post',checkLogin);
app.post('/post',ArticleController.saveArticle);

app.get('/getarticles',checkLogin);
app.get('/getarticles',ArticleController.getUserArticle);

function checkLogin(req, res, next) {
	if(!req.session.user) {
		req.flash('error', '您还没有登录!');
		return res.redirect('/login');
	}
	next();
};

function checkNotLogin(req, res, next) {
	if(req.session.user) {
		req.flash('error', '您已经登录!');
		return res.redirect('back'); //返回之前的页面
	}
	next();
};








};