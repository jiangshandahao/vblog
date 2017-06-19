var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var articleSchema = new Schema({
  author: {
  	  username: String,
	  mobile: String,
	  email: String,
	  avatar: String,
	  signature: String,
	  badge:String
  },
  atitle: {type: String, required:true},
  adate: {type: Date},
  modified_date: {type: Date},
  abrief: String,
  content:String,
  main_picture:String,
  keywords:String,
  channels:[String],
  comments:[OBjectId],
  agood:[OBjectId],
  amark:[OBjectId],
  status:Number
}, {collection: 'article'});

mongoose.model('ArticleModel', articleSchema);