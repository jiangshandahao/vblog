var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = new Schema({
  pid: {type: String, required:true},
  username: {type: String},
  avatar: {type: String},
  content: {type: String},
  cdate: {type: Date},
  like: [],
  unlike: []
}, {collection: 'comments'});

mongoose.model('CommentModel', commentSchema);