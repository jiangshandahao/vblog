require('../models/user_info_model.js');
var mongoose = require('mongoose'),
	ObjectID = require('mongodb').ObjectID,
    UserInfoModel = mongoose.model('UserInfoModel');

//保存点赞过的文章
exports.saveGoodArticle = function(req, res, next){
	UserInfoModel.findOne({
			user_id: new ObjectID(req.body.uid)
		})
		.exec(function(err, userinfo) {
			if(err) {
				res.send({
					'error': "点赞失败"
				});
			} else {
				if(userinfo) {//如果已经存在userinfo
					var index = userinfo.goods.findIndex(function(v){
						return v._id ===  req.body.pid;
					});
					if(index === -1){
						if(req.body.type === 'good') {
							userinfo.update({
									$push: {
										goods: req.body.article
									}
								})
								.exec(function(err, updatedUserinfo) {
									if(err) {
										res.send({
											'error': "点赞失败"
										});
									} else {
										next();
									}
							});
						}else{
							next();
						}
					}else{
						if(req.body.type === 'cancelgood') {
							var p = userinfo.goods[index];
							userinfo.update({
									$pull: {
										goods:p
									}
								})
								.exec(function(err, updatedUserinfo) {
									if(err) {
										res.send({
											'error': "取消点赞失败"
										});
									} else {
										next();
									}
							});
						}else{
							next();
						}
					}
					
				}else{
					if(req.body.type === 'good') {
						var userinfoModel = new UserInfoModel({
							user_id: req.body.uid,
							marks: [],
							goods: [req.body.article],
							followers: [],
							idols: []
						});
						
						userinfoModel.save(function(err, userinfo) {
							if(err) {
								res.send({
									'error': "点赞失败"
								});
							} else {
								next();
							}
						});
					}else{
						next();
					}
				}
			}
	});
	


};

//保存收藏过的文章
exports.saveMarkArticle = function(req, res, next){
	UserInfoModel.findOne({
			user_id: new ObjectID(req.body.uid)
		})
		.exec(function(err, userinfo) {
			if(err) {
				res.send({
					'error': "收藏文章失败"
				});
			} else {
				if(userinfo) {//如果已经存在userinfo
					var index = userinfo.marks.findIndex(function(v){
						return v._id ===  req.body.pid;
					});
					if(index === -1){
						if(req.body.type === 'mark') {
							userinfo.update({
									$push: {
										marks: req.body.article
									}
								})
								.exec(function(err, updatedUserinfo) {
									if(err) {
										res.send({
											'error': "收藏文章失败"
										});
									} else {
										next();
									}
							});
						}else{
							next();
						}
					}else{
						if(req.body.type === 'cancelmark') {
							var p = userinfo.marks[index];
							userinfo.update({
									$pull: {
										marks:p
									}
								})
								.exec(function(err, updatedUserinfo) {
									if(err) {
										res.send({
											'error': "收藏文章失败"
										});
									} else {
										next();
									}
							});
						}else{
							next();
						}
					}
					
				}else{
					if(req.body.type === 'mark') {
						var userinfoModel = new UserInfoModel({
							user_id: req.body.uid,
							marks: [req.body.article],
							goods: [],
							followers:[],
							idols:[]
						});
						
						userinfoModel.save(function(err, userinfo) {
							if(err) {
								res.send({
									'error': "收藏文章失败"
								});
							} else {
								next();
							}
						});
					}else{
						next();
					}
				}
			}
	});

};

//获取用户收藏的文章
exports.getUserMarks = function(req, res){
	var uid = !req.query.requid == false ? req.query.requid : req.session.user._id;
	var numPerPage = 8;
	var nowPage = !req.query.nowpage == false ? req.query.nowpage : 1;
	
	UserInfoModel.findOne({
			user_id: new ObjectID(uid)
		})
		
		.exec(function(err, userinfo) {
			if(err) {
				req.flash('error', "获取收藏文章列表失败");
				res.json([]);
			} else {
				var start = (nowPage - 1) * numPerPage;
				var pend = start + numPerPage;
				var end = (pend > userinfo.marks.length) ? userinfo.marks.length : pend;
				res.json(userinfo.marks.slice(start, end));
			}
	
		});
};

//获取用户点赞的文章
exports.getUserGoods = function(req, res){
	var uid = !req.query.requid == false ? req.query.requid : req.session.user._id;
	var numPerPage = 8;
	var nowPage = !req.query.nowpage == false ? req.query.nowpage : 1;
	UserInfoModel.findOne({
			user_id: new ObjectID(uid)
		})
		.exec(function(err, userinfo) {
			if(err) {
				req.flash('error', "获取收藏文章列表失败");
				res.json([]);
			} else {
				var start = (nowPage - 1) * numPerPage;
				var pend = start + numPerPage;
				var end = (pend > userinfo.goods.length) ? userinfo.goods.length : pend;
				res.json(userinfo.goods.slice(start, end));
			}
	
		});
};

//获取指定ID的用户关注
exports.getUserInfoById = function(req, res){
	var uid = !req.query.uid == false ? req.query.uid : req.session.user._id;
	
	UserInfoModel.findOne({
			user_id: new ObjectID(uid)
		})
		.exec(function(err, userinfo) {
			if(err) {
				res.send({
					'error': "获取用户信息失败"
				});
			} else {
				if(userinfo){
					res.json(userinfo);
				}else{
					res.send({
						'error': "获取用户信息失败"
					});
				}
			}
	
		});
};

//我关注别人--> 向别人用户的followers写入数据
exports.saveFollow = function(req, res, next){
	
	var now_user =  req.body.now_user;
	var req_user = req.body.req_user;
	console.log(req.body);
	UserInfoModel.findOne({
			user_id: new ObjectID(req_user._id)
		})
		.exec(function(err, userinfo) {
			if(err) {
				res.send({
					'error': "关注失败"
				});
			} else {
				if(userinfo) { //如果已经存在userinfo
					if(req.body.type === 'follow') {
						userinfo.update({
								$push: {
									followers: now_user
								}
							})
							.exec(function(err, updatedUserinfo) {
								if(err) {
									res.send({
										'error': "关注失败"
									});
								} else {
									next();
								}
							});
					} else {
						next();
					}
					
				} else {
					if(req.body.type === 'follow') {
						var userinfoModel = new UserInfoModel({
							user_id: req_user._id,
							marks: [],
							goods: [],
							followers: [now_user],
							idols: []
						});
					
						userinfoModel.save(function(err, userinfo) {
							if(err) {
								res.send({
									'error': "关注失败"
								});
							} else {
								next();
							}
						});
					} else {
						next();
					}
				}
			}
		});
};

//我关注别人--> 向自己的idols写入数据
exports.saveIdol = function(req, res){
	
	var now_user =  req.body.now_user;
	var req_user = req.body.req_user;
	
	UserInfoModel.findOne({
			user_id: new ObjectID(now_user._id)
		})
		.exec(function(err, userinfo) {
			if(err) {
				res.send({
					'error': "关注失败"
				});
			} else {
				if(userinfo) { //如果已经存在userinfo
					if(req.body.type === 'follow') {
						userinfo.update({
								$push: {
									idols: req_user
								}
							})
							.exec(function(err, updatedUserinfo) {
								if(err) {
									res.send({
										'error': "关注失败"
									});
								} else {
									res.send({
										'success': "关注成功"
									});
								}
							});
					} else {
						res.send({
							'success': "关注成功"
						});
					}
					
				} else {
					if(req.body.type === 'follow') {
						var userinfoModel = new UserInfoModel({
							user_id: now_user._id,
							marks: [],
							goods: [],
							followers: [],
							idols: [req_user]
						});
					
						userinfoModel.save(function(err, userinfo) {
							if(err) {
								res.send({
									'error': "关注失败"
								});
							} else {
								res.send({
									'success': "关注成功"
								});
							}
						});
					} else {
						res.send({
							'success': "关注成功"
						});
					}
				}
			}
		});
};
	
exports.cancelFollow = function(req, res, next){
	
	var now_user =  req.body.now_user;
	var req_user = req.body.req_user;
	
	UserInfoModel.findOne({
			user_id: new ObjectID(now_user._id)
		})
		.exec(function(err, userinfo) {
			if(err) {
				res.send({
					'error': "取消关注失败"
				});
			} else {
				if(userinfo) { //如果已经存在userinfo
					var index = userinfo.idols.findIndex(function(v){
						return v._id ===  req_user._id;
					});
					if(index !== -1) {
						var p = userinfo.idols[index];
						userinfo.update({
								$pull: {
									idols: p
								}
							})
							.exec(function(err, updatedUserinfo) {
								if(err) {
									res.send({
										'error': "取消关注失败"
									});
								} else {
									next();
								}
							});
					} else {
						next();
					}
					
				} else {
					next();
				}
			}
		});
};

exports.cancelIdol = function(req, res){
	
	var now_user =  req.body.now_user;
	var req_user = req.body.req_user;
	
	UserInfoModel.findOne({
			user_id: new ObjectID(req_user._id)
		})
		.exec(function(err, userinfo) {
			if(err) {
				res.send({
					'error': "取消关注失败"
				});
			} else {
				if(userinfo) { //如果已经存在userinfo
					var index = userinfo.followers.findIndex(function(v){
						return v._id ===  now_user._id;
					});
					if(index !== -1) {
						var p = userinfo.followers[index];
						userinfo.update({
								$pull: {
									followers: p
								}
							})
							.exec(function(err, updatedUserinfo) {
								if(err) {
									res.send({
										'error': "取消关注失败"
									});
								} else {
									res.send({
										'success': "取消关注成功"
									});
								}
							});
					} else {
						res.send({
							'success': "取消关注成功"
						});
					}
					
				} else {
					res.send({
						'success': "取消关注成功"
					});
				}
			}
		});
};
	
