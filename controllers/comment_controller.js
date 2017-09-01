require('../models/comment_model.js');
var mongoose = require('mongoose'),
	ObjectID = require('mongodb').ObjectID,
    CommentModel = mongoose.model('CommentModel');
    
exports.getCommentsByPid = function(req, res){
	if( !req.query.pid ) {
		res.send({
			'error': "查询评论失败"
		});
	}else{
		var pid = req.query.pid;
		
		CommentModel.find({
				pid: new ObjectID(pid)
			})
			.exec(function(err, comments) {
				if(err) {
					res.send({
						'error': "查询评论失败"
					});
				} else {
					res.send(comments);
				}
		
		});
	}
	
};

exports.newComment = function(req, res){
	console.log(req.body);
	var commentModel = new CommentModel({
		  pid: new ObjectID(req.body.pid),
		  username: req.body.username,
		  avatar: req.body.avatar,
		  content: req.body.content,
		  cdate: new Date(),
		  like: [],
		  unlike: []
	});
	commentModel.save(function(err, comment) {
		if(err) {
			res.send({
				'error': "添加评论失败"
			});
		} else {
			res.send({
				'success': "添加评论成功",
				'comment':comment
			});
		}
	});
	
};

exports.goodCommentHandler = function(req, res){
	if( !req.body.uid || !req.body.cid) {
		res.send({
			'error': "点赞失败"
		});
	}else{
		CommentModel.findOne({
			"_id": new ObjectID(req.body.cid)
		})
		.exec(function(err, comment) {
			if(err) {
				res.send({
					'error': "点赞失败"
				});
			} else {
				if(comment.like.indexOf(req.body.uid) === -1){
					comment.update({
							$push: {
								like: req.body.uid
							}
						})
						.exec(function(err, updatedComment) {
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
					comment.update({
							$pull: {
								like: req.body.uid
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
				}
			
			}
		});
	}
};