require('../models/article_model.js');
var mongoose = require('mongoose'),
	ObjectID = require('mongodb').ObjectID,
    ArticleModel = mongoose.model('ArticleModel');

//新建或更新保存草稿
exports.saveArticle = function(req, res){
	//把关键字组合成数组
	var keywords = new Array();
	keywords[0] = req.body.tag1;
	keywords[1] = req.body.tag2;
	keywords[2] = req.body.tag3;
	keywords[3] = req.body.tag4;
	//文章内容
	var content = req.body.editorValue == undefined ? "<p></p>" : req.body.editorValue;
	//文章频道
	var mychannel  = (new RegExp("^string:").test(req.body.channel) == true) ?  req.body.channel.substr(7) : "";
	//文章状态
	var status = Number(req.body.status);
//	console.log(req.body);
	//当文章_id 不存在时， 新建文章
	if(!req.body.post_id){
		var articleModel = new ArticleModel({
			author_id: req.session.user._id,
			author_info: {
				username: req.session.user.username,
				mobile: req.session.user.mobile,
				email: req.session.user.email,
				avatar: 'http://resources.vcaomao.com/images/default@256.jpg',
				signature: req.session.user.signature,
				badge: req.session.user.badge
			},
			atitle: req.body.title,
			adate: new Date(),
			modified_date: new Date(),
			abrief: req.body.abrief,
			content: content,
			main_picture: "http://resources.vcaomao.com/images/200920899717.jpg",
			keywords: keywords,
			mychannel: mychannel,
//			comments: [],
			agood: [],
			amark: [],
			status: status 
		});
		
		articleModel.save(function(err, user) {
			if(err) {
				req.flash('error', "保存草稿失败");
				res.redirect('/post');
			} else {
				req.flash('success', '保存草稿成功');
				res.redirect('/post');
			}
		});
		
	}else{
		//当文章已经存在时， 更新
		var updateArticleInfo = {
			atitle: req.body.title,
			adate: new Date(),
			modified_date: new Date(),
			abrief: req.body.abrief,
			content: content,
			main_picture: "http://resources.vcaomao.com/images/200920899717.jpg",									keywords: keywords,
			mychannel: mychannel,
			status: status 
		};
		ArticleModel.findOne({"_id": new ObjectID(req.body.post_id)})
		.exec(function(err, article) {
			if(err) {
				req.flash('error', "更新草稿失败");
				res.redirect('/post');
			} else {
				article.update({
					$set:updateArticleInfo
				})
				.exec(function(err, updatedArticle){
					if(err){
						req.flash('error', "更新草稿失败");
						res.redirect('/post');
					}else{
						//console.log(updatedArticle);//{ n: 1, nModified: 1, ok: 1 }	
						if(status == 1)//草稿更新
						{
							req.flash('success', '更新草稿成功');
							res.redirect('/post');
						}
						else if(status == 2){ //发布提交审核
							req.flash('success', '发布成功，文章已经提交审核');
							res.redirect('/');
						}
						else{
							res.redirect('/');
						}
					}
				});
			}
		});			
	}
};

//API 接口， 获取草稿箱列表
exports.getUserAritcles = function(req, res){
	
	var status = -1; 

	switch (req.query.type){
		case "drafts":
			status = 1;
			break; 
		case "checking":
			status = 2; 
			break; 
		case "articles":
			status = 3; 
			break; 
		
		default:
			break;
	}
	
	var uid = !req.query.requid == false ? req.query.requid : req.session.user._id;
	//console.log(uid);
	ArticleModel.find({ 
		author_id: new ObjectID(uid),
		status: status
	})
	.limit(8)
	.sort({modified_date: -1})
	.exec(function(err, articles) {
		if(err){
			req.flash('error', "获取文章列表失败");
			res.json([]);
		}else {
			res.json(articles);
		}
		
	});
};

exports.getArticleById = function(req, res){
	
	var aid = req.params.articleid;
	ArticleModel.findOne({ 
		_id: new ObjectID(aid)
	})
	.exec(function(err, article) {
		if(err){
			req.flash('error', "获取文章失败");
			res.redirect('/');
		}else {
			if(article){
				res.render('article', {
					title: '微草帽－用户文章',
					user: req.session.user,
					article:article,
					success: req.flash('success').toString(),
					error: req.flash('error').toString()
				});
			}else{
				req.flash('error', "获取文章失败");
				res.redirect('/');
			}
		}
		
	});
};

