var users = require("./users");

module.exports = function(app){

/*
 * 首页 
 */
app.get('/', function(req, res, next) {
  	res.render('index', { 
      title: '首页', 
      user:false,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});


users(app);


};
