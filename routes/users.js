var UserController = require('../controllers/user_controller.js');

module.exports = function(app){
/* 注册页面路由 */
app.get('/signup', function(req, res, next) {
 	res.render('signup', { 
      title: '注册', 
      user:false,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});
/* 提交注册路由 */
app.post('/signup', [UserController.signUpValidate, UserController.signUp]);

app.post('/is_mobile_not_exist', UserController.isMobileNotExist);

app.post('/is_username_not_exist', UserController.isUserNameNotExist);
};