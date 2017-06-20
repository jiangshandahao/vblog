require('../models/article_model.js');
var mongoose = require('mongoose'),
	ObjectID = require('mongodb').ObjectID,
    ArticleModel = mongoose.model('ArticleModel');

exports.saveArticle = function(req, res){
	//当文章_id 不存在时， 新建文章
	if(!req.body._id){
		var keywords = new Array();
		keywords[0] = req.body.tag1;
		keywords[1] = req.body.tag2;
		keywords[2] = req.body.tag3;		
		keywords[3] = req.body.tag4;

		var articleModel = new ArticleModel({
			author_id: req.session.user._id,
			author_info: {
				username: req.session.user.username,
				mobile: req.session.user.mobile,
				email: req.session.user.email,
				avatar: 'images/default@256.jpg',
				signature: req.session.user.signature,
				badge: req.session.user.badge
			},
			atitle: req.body.title,
			modified_date:new Date(),
			abrief: req.body.abrief,
			content: req.body.editorValue,
			main_picture: "",
			keywords: keywords,
			channels: [],
			comments: [],
			agood: [],
			amark: [],
			status: 1
		});
		articleModel.save(function(err, user) {
			if(err) {
				req.flash('error', "保存文章失败");
				res.redirect('/post');
			} else {
				req.flash('success', '保存文章成功');
				res.redirect('/post');
			}
		});
		
	}else{
		//当文章已经存在时， 更新
		
	}



};

//API 接口， 获取文章列表
exports.getUserArticle = function(req, res){
	ArticleModel.find({ author_id: new ObjectID(req.session.user._id)})
	.exec(function(err, articles) {
		if(err){
			req.flash('error', "获取文章列表失败");
			res.json({});
		}else {
			res.json(articles);
		}
		
	});
};