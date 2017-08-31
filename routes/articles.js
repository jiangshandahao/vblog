var ArticleController = require('../controllers/article_controller.js');

module.exports = function(app){

//发布文章页
app.get('/post',checkLogin);
app.get('/post',function(req,res){
	res.render('post', {
		title: '微草帽－写文章',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});
//保存草稿、发布文章
app.post('/post',checkLogin);
app.post('/post',ArticleController.saveArticle);

//一个获取文章列表的接口API，可以用于angular中的HTTP请求
app.get('/getarticles',ArticleController.getUserAritcles);

//查看文章
app.get('/article/:articleid', ArticleController.getArticleById);

//提交评论
app.post('/newcomment',checkLogin);
app.post('/newcomment',ArticleController.newComment);

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