var Database = require('./serverdb.js');
var db = new Database();
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

var options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
  passphrase : 'yatra'
};


var app = require('https').createServer(options, navigator)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8080);

function navigator(req,res){
  if (req.method == "POST") {
    console.log("Data through POST method!");
    req.on("data", function(data){
      var dataSt = data.toString();
      var formData = dataSt.split("&");
      for(var i = 0; i < formData.length; i++) {

        var fields = formData[i].split("=");
        for(var j = 0; j < fields.length; j++) {
          console.log(decodeURIComponent(fields[j]));
        }
      }

    });
  }


    var pathname=url.parse(req.url).pathname;
    switch(pathname){
        case '/logmein':
            load('/logmein.html',res);
        break;
        case '/mymobile':
        	load('/mymobile.html',res);
        break;

        case '/encryption.html':
          load('/encryption.html',res);
        break;

        case '/bg.png':
          load('/bg.png',res);
        break;
        case '/plugin':
          fs.readFile(__dirname + '/plugin.js',
          function (err, data) {
            if (err) {
              res.writeHead(500);
              return res.end('Error loading index.html');
            }
            res.writeHead(200, { 'Content-Type': 'text/javascript'});
            res.end(data);
          });
          
        break;
        default:
            load('/error.html',res);
        break;
    }

}


function load (page,res) {
  fs.readFile(__dirname + page,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

function askLogin(data, socket){
    
    console.log("Login details for "+ data +" requested");
    db.activeConnection.addConnection(data, socket.id, socket.handshake.address.address);
    var json_data = JSON.parse(data);
    var socketId = db.mobile.getCellphones(json_data.data.username);
    console.log(data);

    var msg = {"title" : "error" , "data" : {"msg" : "User not found!"}};
    var string_msg = JSON.stringify(msg);

    if (socketId.length == 0) {
      socket.emit('server',string_msg);
    }
    else {
      for(var i = 0; i < socketId.length; i++) {
       io.sockets.socket(socketId[i]).emit('pushInf', '{"title" : "getLogin", "data" : {"socketId" : "'+ socket.id +'", "IP" : "'+ socket.handshake.address.address +'", "domain" : "'+ json_data.data.domain + '"}}');
      }
    }
}

function syncLogin(data, socket) {
  console.log("Sync for "+ data +" requested");
    db.activeConnection.addConnection(data, socket.id, socket.handshake.address.address);
    var json_data = JSON.parse(data);

    //var js = {"title" : "sync" , "data" : {"SmartUser" : user, "domain" : location.host, "username" : site_username, "password" : passIn.value}};

    var socketId = db.mobile.getCellphones(json_data.data.SmartUser);

    var msg = {"title" : "error" , "data" : {"msg" : "User not found!"}};
    var string_msg = JSON.stringify(msg);

    if (socketId.length == 0) {
      socket.emit('server',string_msg);
    }
    else {
      for(var i = 0; i < socketId.length; i++) {
       io.sockets.socket(socketId[i]).emit('pushInf', data);
      }
    }
}

io.sockets.on('connection', function (socket) {
	//console.log("connection from " + socket.handshake.address.address);
	//console.log("User Requested" + 'username_variable');

	socket.on('cellphone', function(data){
		console.log('New cellphone connected. -> ' + data + '->' + socket.id);
		db.mobile.addCellphone(data, socket.id); 
	});

	socket.on('site', function(data) {
    var json_data = JSON.parse(data);
    var title = json_data.title;
    if(title == "sync") {
      syncLogin(data, socket);
    }
    else if(title == "getLogin"){
      askLogin(data, socket);
    }
	});

  socket.on('mobile', function(data) {
  	console.log('Mobile sent logins '+ data);
    var json_data = JSON.parse(data);
  	io.sockets.socket(json_data.data.socketId).emit('server', data);
  });

});

