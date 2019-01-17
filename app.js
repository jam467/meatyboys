var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var getRounds = require('./routes/getRounds');
var getPlayers = require('./routes/getPlayers');
var getSquads = require('./routes/getSquads');
var getDraft = require('./routes/getDraft');
var Draft = require('./routes/Draft');
var getDraft = require('./routes/draftDay/getRemaining');
var setDraft = require('./routes/draftDay/setRemaining');
var startTimer = require('./routes/timer');
var getTimer = require('./routes/draftDay/getTimer');
var setUsers = require('./routes/draftDay/setUsers');
var getUsers = require('./routes/draftDay/getUsers');
var getVisibleUser = require('./routes/draftDay/getVisibleUser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/getRounds', getRounds);
app.use('/getPlayers', getPlayers);
app.use('/getSquads', getSquads);
app.use('/startTimer', startTimer);
app.use('/getDraft', getDraft);
app.use('/Draft', Draft);
app.use('/getDraft', getDraft);
app.use('/setDraft', setDraft);
app.use('/getUsers', getUsers);
app.use('/setUsers', setUsers);
app.use('/getVisibleUser', getVisibleUser);
app.use('/getTimer', getTimer);


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
