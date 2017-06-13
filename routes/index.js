var users = require("./users");
var Geetest = require('../lib/gt-sdk');

module.exports = function(app){

/*
 * 首页 
 */
app.get('/', function(req, res, next) {
  	res.render('index', { 
      title: '首页', 
      user:req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});

// pc 端接口

var pcGeetest = new Geetest({
	privateKey: 'e557f740a3817e5e60282b47959be216',
	publicKey: '2a27abb1f9d0a062d862d01b93919abc'
});

app.get("/pc-geetest/register", function(req, res) {
	// 向极验申请一次验证所需的challenge
	pcGeetest.register(function(data) {
		res.send(JSON.stringify({
			gt: pcGeetest.publicKey,
			challenge: data.challenge,
			success: data.success
		}));
	});
});

app.post("/pc-geetest/validate", function(req, res) {
	// 对ajax提交的验证结果值进行验证
	pcGeetest.validate({
		challenge: req.body.geetest_challenge,
		validate: req.body.geetest_validate,
		seccode: req.body.geetest_seccode
	}, function(err, result) {

		var data = {
			status: "success",
			info: '登录成功'
		};

		if(err || !result) {

			data.status = "fail";
			data.info = '登录失败';
		}

		res.send(JSON.stringify(data));

	});
});

app.post("/pc-geetest/form-validate", function(req, res) {
	// 对form表单的结果进行验证
	pcGeetest.validate({

		challenge: req.body.geetest_challenge,
		validate: req.body.geetest_validate,
		seccode: req.body.geetest_seccode

	}, function(err, result) {
		if(err || !result) {
			res.send("<h1 style='text-align: center'>登陆失败</h1>");
		} else {
			res.send("<h1 style='text-align: center'>登陆成功</h1>");
		}
	});
});

users(app);


};
