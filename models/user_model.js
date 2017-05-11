var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
  username: {type: String, index: 1, required:true, unique: true},
  mobile: {type: String, index: 1, required:true, unique: true},
  hashed_password: {type: String, required:true},
  email: {type: String},
  avatar: String,
  signature: String,
  badge:String
}, {collection: 'user'});

mongoose.model('UserModel', userSchema);