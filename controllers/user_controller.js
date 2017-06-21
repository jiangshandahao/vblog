require('../models/user_model.js');
var crypto = require('crypto'),
	mongoose = require('mongoose'),
    UserModel = mongoose.model('UserModel');

// 加密密码明文
var hashPW = function (pwd){
  return crypto.createHash('sha256').update(pwd).
         digest('base64').toString();
};
//用户名格式验证:用户名的长度必须在3-16字符之间
var validateUsername =  function(username){
	var usernameRegex = /^.{3,16}$/;
	return usernameRegex.test(username);
};

//手机号码格式验证(中国大陆11位手机号)
var validateMobile =  function(mobile){
	var mobileRegex = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
	return mobileRegex.test(mobile);
};

//密码格式验证:密码长度至少为6个字符
var validatePassword =  function(password){
	var passwordRegex = /^.{6,}$/;
	return passwordRegex.test(password);
};

//获取用户主页
exports.getHomePageByName = function(req, res){
	//如果当前用户未登录
	console.log(req.session.user);
	console.log(req.params );
	var reqName = req.params.username;
	var is_login = (!req.session.user == false);//当前用户是否登录
	
	if(req.session.user && req.session.user.username == reqName){
		console.log("当前用户");
		res.render('homepage', {
			title: '微草帽－用户文章',
			user: req.session.user,
			req_user:req.session.user,
			is_now_user: true,
			is_login: is_login,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	}else{
		console.log("非当前用户");
		UserModel.findOne({'username':reqName})
	  	.exec(function(err, page_user) {
		  	if(err){
		  		req.flash('error', '获取用户页面失败');
				res.redirect('/');
		  	}
		    if (!page_user){
		    		req.flash('error', '获取用户页面失败');
		    		res.redirect('/');
		    }
		    else{
			    	res.render('homepage', {
			    		title: '微草帽－用户文章',
			    		user:req.session.user,
			    		req_user: page_user,
			    		is_now_user: false,
			    		is_login: is_login,
			    		success: req.flash('success').toString(),
			    		error: req.flash('error').toString()
			    	});
		    }
		});
	}
	//UserModel.findOne()返回的是Mongoose中的Document对象
	//而UserModel.exec()返回的是一个Promise对象
	//当前getUserByMobile返回的是一个undefined, 因为node异步操作，findOne还没执行完， getUserByMobile 这个函数已经返回。
};


	

	
//注册页面字段验证
exports.signUpValidate = function(req, res, next){
	var error = [];
	if(!validateUsername(req.body.mobile)) {
		error.push("手机号格式错误");
	}
	if(!validateUsername(req.body.username)) {
		error.push("用户名的长度必须在3-16字符之间");
	}
	if(!validatePassword(req.body.password)) {
		error.push("密码长度至少为6个字符");
	}
	
	if(error.length){
		req.flash('error', error.toString());
		res.redirect('/signup');
	}
	else{
		next();
	}
};

//注册，向数据库存储新用户
exports.signUp = function(req, res){
  var userModel = new UserModel({
  	'username':req.body.username,
  	'mobile':req.body.mobile,
  	'avatar':'http://resources.vcaomao.com/images/default@256.jpg',
  	'hashed_password': hashPW(req.body.password)
  });  
  
  userModel.save(function(err, user) {
    if (err){
    	  req.flash('error', "注册用户失败");
      res.redirect('/signup');
    } else {
    		req.session.regenerate(function(){
	        req.session.user = user;
	        req.flash('success', '注册成功');
			res.redirect('/');
	     });
    }
  });
};

//验证手机号是否不存在
exports.isMobileNotExist = function(req, res){
	UserModel.findOne({'mobile':req.body.mobile})
	  .exec(function(err, user) {
	  	if(err){
	  		res.send(true); 
	  	}
	    if (!user){
	      res.send(true); 
	    }
	    else{
	    		res.send(false); 
	    }
	});
};

//验证手机号是否不存在
exports.isUserNameNotExist = function(req, res){
	UserModel.findOne({'username':req.body.username})
	  .exec(function(err, user) {
	  	if(err){
	  		res.send(true); 
	  	}
	    if (!user){
	      res.send(true); 
	    }
	    else{
	    		res.send(false); 
	    }
	});
};


//登录页面字段验证
exports.loginValidate = function(req, res, next){
	var error = [];
	if(!validateMobile(req.body.mobile) ) {
		error.push("手机号码格式错误");
	}
	
	if(!validatePassword(req.body.password)) {
		error.push("密码长度至少为6个字符");
	}
	
	if(error.length){
		req.flash('error', error.toString());
		res.redirect('/login');
	}
	else{
		next();
	}
};

//注册，向数据库存储新用户
exports.logIn = function(req, res){
	
  UserModel.findOne({ mobile: req.body.mobile })
  .exec(function(err, user) {
    if (!user){
     	req.flash('error', "手机号码不存在");
		res.redirect('/login');
    } else if (user.hashed_password === 
               hashPW(req.body.password.toString())) {
	     req.session.regenerate(function(){
	     	user.hashed_password = "";
	        req.session.user = user;
	        req.flash('success', '登录成功');
			res.redirect('/');
	     });
    }else{
	    	req.flash('error', "手机号码或密码错误");
	    	res.redirect('/login');
    }
    if(err){
      	req.flash('error', "登录失败");
	    	res.redirect('/login');
    }
  });
};

//修改用户信息

exports.updateUserInfo = function(req, res){
 	res.render('user_info', { 
      title: '更新用户信息', 
      user:req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
   });
};