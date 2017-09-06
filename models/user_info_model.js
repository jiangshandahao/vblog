var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userInfoSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, index: 1, required:true, unique: true},
  marks:[],
  goods:[],
  followers:[],
  idols:[]
  
}, {collection: 'user_info'});

mongoose.model('UserInfoModel', userInfoSchema);