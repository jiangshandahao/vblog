var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var settings = require('./settings');
var routes = require('./routes/index');

var mongoose = require('mongoose') ;
mongoose.Promise = global.Promise;  
var 	connect = mongoose.connect('mongodb://localhost:27017/vblog');

var expressSession = require('express-session');
var MongoStore = require('connect-mongo')({session: expressSession});

var flash = require('connect-flash');

var app = express();

// view engine setup
app.engine('.html',require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(cookieParser());
/*设置store参数为MongoStore实例，将会话信息存储到数据库中*/
app.use(expressSession({
	secret:settings.cookieSecret,
	key:settings.database_name,
	cookie:{maxAge:1000 * 60 * 60 * 24 * 7 },//7days
//	store:new MongoStore({
//		db:settings.database_name,
//	    host:settings.host,
//	    port:settings.port
//	}),
	resave:false,
	saveUninitialized:true
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


//app.use('/', index);
//app.use('/users', users);
/*路由控制器*/
routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
