var UserInfoController = require('../controllers/user_info_controller.js');
var UserController = require('../controllers/user_controller.js');

module.exports = function(app){

//获取指定ID的用户信息
app.get('/getuserinfo', UserInfoController.getUserInfoById);

//获取用户收藏过的文章
app.get('/usermarks', UserInfoController.getUserMarks);

//获取用户点赞过的文章
app.get('/usergoods', UserInfoController.getUserGoods);

//关注别人
app.post('/follow', [UserInfoController.saveFollow, UserInfoController.saveIdol]);

//取消关注
app.post('/canclefollow', [UserInfoController.cancelFollow, UserInfoController.cancelIdol]);


};