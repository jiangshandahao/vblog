var path = require('path');
var users = require("./users");
var articles = require("./articles");
var user_info = require("./user_info");
var Geetest = require('../lib/gt-sdk');
var ueditor = require("../lib/ueditor");
var uploadimg = require("../lib/uploadimg");

var ChannelController = require('../controllers/channel_controller.js');

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


app.get('/getchannels', ChannelController.getChannelsByShowType);

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


// 支持七牛上传，如有需要请配置好qn参数，如果没有qn参数则存储在本地
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), {
    qn: {
    		accessKey: 'P-TttbGVOwlhnfNzDe4IHavjVk21lDGwnkWM8mE6',
    		secretKey: 'qAo9JTyYXHaI5g2PT88KEbcPpRYWg44CGDSerazR',
    		bucket: 'vcaomao-users',
    		origin: 'http://users.vcaomao.com'
    }
}, function(req, res, next) {
  // ueditor 客户发起上传图片请求
  var imgDir = '/img/ueditor/'
  if(req.query.action === 'uploadimage'){
    var foo = req.ueditor;

    var imgname = req.ueditor.filename;

    
    res.ue_up(imgDir); //你只要输入要保存的地址 。保存操作交给ueditor来做
  }
  //  客户端发起图片列表请求
  else if (req.query.action === 'listimage'){
    
    res.ue_list(imgDir);  // 客户端会列出 dir_url 目录下的所有图片
  }
  // 客户端发起其它请求
  else {

    res.setHeader('Content-Type', 'application/json');
    res.redirect('/plugins/ueditor/ueditor.config.json');
}}));

app.use("/uploadimg", uploadimg(path.join(__dirname, 'public'), {
    qn: {
    		accessKey: 'P-TttbGVOwlhnfNzDe4IHavjVk21lDGwnkWM8mE6',
    		secretKey: 'qAo9JTyYXHaI5g2PT88KEbcPpRYWg44CGDSerazR',
    		bucket: 'vcaomao-users',
    		origin: 'http://users.vcaomao.com'
    }
}, function(req, res, next) {
  // ueditor 客户发起上传图片请求
  var imgDir = '/img/ueditor/'
  if(req.query.action === 'uploadimage'){
    res.ue_up(imgDir); //你只要输入要保存的地址 。保存操作交给ueditor来做
  }
  
}));



users(app);
articles(app);
user_info(app);


};
