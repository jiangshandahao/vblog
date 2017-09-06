require('../models/channel_model.js');
var mongoose = require('mongoose'),
	ObjectID = require('mongodb').ObjectID,
    ChannelModel = mongoose.model('ChannelModel');
    
exports.getChannelsByShowType = function(req, res){
	
	var showtype = !req.query.showtype ? "" : req.query.showtype;
	ChannelModel.find({
		show_type: showtype
	})
	.exec(function(err, channels) {
		if(err) {
			res.send({
				'error': "查询频道列表失败"
			});
		} else {
			res.send(channels);
		}
		
	});
	
};

//测试功能API
exports.newChannel = function(req, res){
	var channelModel = new ChannelModel({
		channel_name: "八卦互联网",
		show_type: "header"
	});
	channelModel.save(function(err, channel) {
		if(err) {
			res.send({
				'error': "添加评论失败"
			});
		} else {
			res.send({
				'success': "添加评论成功"
			});
		}
	});
};

