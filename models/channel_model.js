var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var channelSchema = new Schema({
  channel_name: {type: String, required:true},
  group: {type: String},
  show_type: {type: String}
}, {collection: 'channels'});

mongoose.model('ChannelModel', channelSchema);