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
							goods: [req.body.article]
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
