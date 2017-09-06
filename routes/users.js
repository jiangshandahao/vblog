var UserController = require('../controllers/user_controller.js');

module.exports = function(app){
/* 注册页面路由 */
app.get('/signup', function(req, res, next) {
 	res.render('signup', { 
      title: '注册', 
      user:req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});
/* 提交注册路由 */
app.post('/signup', [UserController.signUpValidate, UserController.signUp]);

/* 登录页面路由 */
app.get('/login', function(req, res, next) {
 	res.render('login', { 
      title: '登录', 
      user:req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});
/* 提交登录路由 */
app.post('/login', [UserController.loginValidate, UserController.logIn]);

//修改用户信息
app.get('/updateuserinfo', checkLogin);
app.get('/updateuserinfo', UserController.updateUserInfo);

//用户主页、个人中心： 我的文章、我的草稿箱、我的待审核文章
app.get('/u/:username',UserController.getHomePageByName);

//User API开放接口：验证手机号是否不存在
app.post('/is_mobile_not_exist', UserController.isMobileNotExist);
//User API开放接口：验证用户名是否不存在
app.post('/is_username_not_exist', UserController.isUserNameNotExist);

//用户注销操作
app.get('/logout', checkLogin);
app.get('/logout', function(req, res) {
	req.session.user = null; /*用户信息存入session*/
	req.flash('success', '退出成功');
	res.redirect('/'); /*登陆成功返回主页*/
});

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