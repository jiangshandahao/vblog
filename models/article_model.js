var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var articleSchema = new Schema({
  author_id: Schema.Types.ObjectId,
  author_info: {
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
  keywords:[String],
  mychannel:String,
  comments:[Schema.Types.ObjectId],
  agood:[Schema.Types.ObjectId],
  amark:[Schema.Types.ObjectId],
  status:Number
}, {collection: 'article'});

mongoose.model('ArticleModel', articleSchema);