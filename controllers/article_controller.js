require('../models/article_model.js');
var mongoose = require('mongoose'),
	ObjectID = require('mongodb').ObjectID,
    ArticleModel = mongoose.model('ArticleModel');

function beforeArticleSave(req){
	//把关键字组合成数组
	var keywords = new Array();
	keywords[0] = req.body.tag1;
	keywords[1] = req.body.tag2;
	keywords[2] = req.body.tag3;
	keywords[3] = req.body.tag4;
	//文章内容
	var content = req.body.editorValue == undefined ? "<p></p>" : req.body.editorValue;
	//文章频道
	var mychannel = (new RegExp("^string:").test(req.body.channel) == true) ? req.body.channel.substr(7) : "";
	//文章状态
	var status = Number(req.body.status);
	
	return {
		create: {
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
			main_picture: req.body.picture_url,
			keywords: keywords,
			mychannel: mychannel,
			agood: [],
			amark: [],
			status: status
		},
		update:{
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
			main_picture: req.body.picture_url,
			keywords: keywords,
			mychannel: mychannel,
			status: status 
		}
	};
};

//新建或更新保存草稿
exports.saveArticle = function(req, res){
	
	//当文章_id 不存在时， 新建文章
	if(!req.body.post_id){
		var okArticle = beforeArticleSave(req).create;
		var articleModel = new ArticleModel(okArticle);
		
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
		var updateArticleInfo = beforeArticleSave(req).update;
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
						if(updateArticleInfo.status == 1)//草稿更新
						{
							req.flash('success', '更新草稿成功');
							res.redirect('/post');
						}
						else if(updateArticleInfo.status == 2){ //发布提交审核
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
		case "trash":
			status = 4;
			break;
		case "fail":
			status = 5;
			break;
		default:
			break;
	}
	
	var uid = !req.query.requid == false ? req.query.requid : req.session.user._id;
	var numPerPage = 8; 
	var nowPage = !req.query.nowpage == false ? req.query.nowpage : 1;
	//console.log(uid);
	ArticleModel.find({ 
		author_id: new ObjectID(uid),
		status: status
	})
	.limit(numPerPage)
	.skip(numPerPage*(nowPage-1))
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

//文章详情页面
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

//文章编辑页面
exports.editArticle = function(req, res){
	var pid = !req.query.pid ? "" : req.query.pid;
	ArticleModel.findOne({ 
		_id: new ObjectID(pid)
	})
	.exec(function(err, article) {
		if(err){
			req.flash('error', "获取文章失败");
			res.redirect('/');
		}else {
			if(article){
				res.render('edit', {
					title: '微草帽－编辑文章',
					user: req.session.user,
					now_article:article,
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


//更改文章状态
exports.updateArticleStatus = function(req, res) {
	var pid = !req.query.pid ? "" : req.query.pid;
	var type = !req.query.type ? "" : req.query.type;
	var status = 0;
	switch(type) {
		case 'delete':
			status = 4;
			break;
		case 'regret':
			status = 1;
			break;
		case 'trashdelete':
			status = 0;
			break;
		default:
			break;
	}
	ArticleModel.findOne({
			"_id": new ObjectID(pid)
		})
		.exec(function(err, article) {
			if(err) {
				res.send({
					'error': "还原文章失败"
				});
			} else {
				
				article.update({
						$set: {
							status:status,
							modified_date:new Date(),
							adate:new Date()
						}
					})
					.exec(function(err, updatedArticle) {
						if(err) {
							res.send({
								'error': type+"文章失败"
							});
						} else {
							res.send({
								'success': type+"文章成功"
							});
						}
					});
			}
		});
};

//文章点赞
exports.goodArticleHandler = function(req, res){
	if(!req.body.uid || !req.body.pid) {
		res.send({
			'error': "点赞失败"
		});
	} else {
		ArticleModel.findOne({
				"_id": new ObjectID(req.body.pid)
			})
			.exec(function(err, article) {
				if(err) {
					res.send({
						'error': "点赞失败"
					});
				} else {
					if(article.agood.indexOf(req.body.uid) === -1) {
						if(req.body.type === 'good'){
							article.update({
									$push: {
										agood: req.body.uid
									}
								})
								.exec(function(err, updatedArticle) {
									if(err) {
										res.send({
											'error': "点赞失败"
										});
									} else {
										res.send({
											'success': "点赞成功"
										});
									}
								});
						}else{
							res.send({
								'success': "点赞成功"
							});
						}
						
					} else {
						if(req.body.type === 'cancelgood') {
						article.update({
								$pull: {
									agood: req.body.uid
								}
							})
							.exec(function(err, updatedComment) {
								if(err) {
									res.send({
										'error': "取消点赞失败"
									});
								} else {
									res.send({
										'success': "取消点赞成功"
									});
								}
							});
						}else{
							res.send({
								'success': "取消点赞成功"
							});
						}
					}
	
				}
			});
	}
};

//文章收藏
exports.markArticleHandler = function(req, res) {
	if(!req.body.uid || !req.body.pid) {
		res.send({
			'error': "收藏文章失败"
		});
	} else {
		ArticleModel.findOne({
				"_id": new ObjectID(req.body.pid)
			})
			.exec(function(err, article) {
				if(err) {
					res.send({
						'error': "收藏文章失败"
					});
				} else {
					if(article.amark.indexOf(req.body.uid) === -1) {
						if(req.body.type === 'mark') {
							article.update({
									$push: {
										amark: req.body.uid
									}
								})
								.exec(function(err, updatedArticle) {
									if(err) {
										res.send({
											'error': "收藏文章失败"
										});
									} else {
										res.send({
											'success': "收藏文章成功"
										});
									}
								});
						} else {
							res.send({
								'success': "收藏文章成功"
							});
						}

					} else {
						if(req.body.type === 'cancelmark') {
							article.update({
									$pull: {
										amark: req.body.uid
									}
								})
								.exec(function(err, updatedArticle) {
									if(err) {
										res.send({
											'error': "收藏文章失败"
										});
									} else {
										res.send({
											'success': "收藏文章成功"
										});
									}
								});
						} else {
							res.send({
								'success': "收藏文章成功"
							});
						}
					}

				}
			});
	}
};
//获得某一个频道的文章
exports.getChannelArticles = function(req, res){
	
	var channel = !req.query.channel ? "" : req.query.channel;
	var numPerPage = 8; 
	var nowPage = !req.query.nowpage == false ? req.query.nowpage : 1;
	var asyn = !req.query.asyn == false ? req.query.asyn : '';
	ArticleModel.find({
			mychannel: channel
//			status: 3
		})
		
		.limit(numPerPage)
		.skip(numPerPage*(nowPage-1))
		.sort({
			"adate": -1
		})
		.exec(function(err, articles) {
			if(err) {
				req.flash('error', "获取文章失败");
				res.redirect('/');
			} else {
				if(asyn === 'asyn'){
					res.send(articles);
				}else{
					res.render('search_articles', {
						title: channel,
						user: req.session.user,
						articles: articles,
						success: req.flash('success').toString(),
						error: req.flash('error').toString()
					});
				}
				
			}
	
		});
};

exports.searchArticles = function(req, res){
	if(req.query.sword){
		var sword  = req.query.sword;
		console.log(sword);

	}else{
		req.flash('error', "搜索文章失败");
		res.redirect('/');
	}
	
};