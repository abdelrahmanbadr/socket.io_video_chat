var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');


var app = express();
var server = require('http').createServer(app);

var io=require('socket.io').listen(server);
var Redis = require('ioredis');
var redis=new Redis();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.get('/chat', function(req, res) {

  res.sendFile( __dirname + "/chat.html" );
});


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

server.listen(3000,function(){
  console.log("Server Runing");
});

//////////////////routes

/////////////////chat

redis.subscribe('ionic-laravel');
///channel must be ionic-laravel

redis.on('message',function(channel,data){

data=JSON.parse(data);
 io.emit(channel, data.data.msg,data.data.room,data.data.name);

});

io.sockets.on('connection', function(socket){


    
   //socket.on take event name and the function to run it 
    socket.on('ionic-laravel', function(msg,room,username) {

      ///to run the event
        io.emit('ionic-laravel', msg,room,username);
       
        
    });

});