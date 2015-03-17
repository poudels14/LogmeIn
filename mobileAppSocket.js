

var host = "https://165.123.214.40:8080";
$(document).ready(function(){
    var script = document.createElement("script");
    script.src= host + "/socket.io/socket.io.js";
    document.body.appendChild(script);

    setTimeout(function(){
        var isConn = Socket_connection.init_connection(window.localStorage.getItem("Smart_user"));
    },2000);
});


var matchDomain = function(x, y){
    var it = y.split(".");
    if(x.match(it[it.length - 2])){
        return true;
    }
    return false;
}
var Socket_connection = {

    "init_connection" : function(Smart_username) {
        var host = "https://165.123.214.40:8080";
        
        var so = "socket = io.connect('" + host + "');";
        var em = "socket.emit('cellphone','" + Smart_username + "');";
        var x = eval(so);
        var y = eval(em);
        if(y) {
            console.log("Smart Phone Registered to Network!");
            this.onConnected();
            return true;
        }
        else {
            console.log("You couldn't be Registered in Network.");
            return false;
        }
    },

    "onConnected" : function(){
        console.log("asdsadas");
        var sM = "socket.on('pushInf', function(data){console.log(\"sad\");Socket_connection.parsePushInf(data)})";

        if(eval(sM)) {
            console.log("Socket Ready.");
            document.getElementById("status_disp").innerHTML = "Connected";
        }
        else {
            console.log("Socket Connection failed!");
        }
    },

    "sendLogin" : {

        "rejectLogin" : function(){
            //json = {"title", "data" : {}};
            console.log("Connection Refused!");
            var msg = {"title" : "error" , "data" : {"message" : "Connection Refused!"}};
            var string_msg = JSON.stringify(msg);
            var x = "socket.emit('mobile','" + string_msg + "');";
            eval(x);
        },

        //json = {"title", "data" : {}};
        "sendLoginDetails" : function(socketId, IP, domain, title){
            var log = Socket_connection.parseDomain(domain, title);
            var SmartUser = window.localStorage.getItem("Smart_user");

            var logins = {"title" : "loginInf" , "data" : {"socketId" : socketId, "SmartUser" : SmartUser, "domain" : domain, "username" : log.username, "password" : log.password}};
            var string_login = JSON.stringify(logins);
            var x = "socket.emit('mobile','" + string_login + "');";
            if(eval(x)){
                console.log("logins sent");
            }
        },

        "showDifferentLogins" : function(socketId, IP, domain){
            var db = getDatabase();
            var db_json = JSON.parse(db);
            var html = "";
            var x1 = "<div style=\"overflow:hidden;padding:100px 0px 0px 0px;width:360px;height:615px;background:rgba(100,100,100,0.6);\" class=\"logins\" id=\"\"> ";
            var x2 = "</div>";

            for(var i = 0; i < db_json.length; i++) {
                if(matchDomain(db_json[i].domain, domain)) {               //check if domain name matches
                    for(var j = 0; j < db_json[i].logins.length; j++) {
                        console.log("function called");  
                        var title = db_json[i].logins[j].title;
                        //var domain = db_json[i].logins[j].domain;
                        html += "<div class=\"topcoat-navigation-bar\" onclick=\'Socket_connection.sendLogin.sendLoginDetails(\"" + socketId + "\", \"" + IP + "\", \"" + domain + "\", \"" + title + "\");$(\"#login_requested_dialog\").remove();\' data-domain=\"" + domain + "\" style=\"color:white;background:rgba(200,200,200,1);\"> <div class=\"topcoat-navigation-bar__item center full\"><h1 class=\"topcoat-navigation-bar__title\">" + title.capitalize() + "</h1></div></div>";
                    }
                }
            }
            if(html == "") {
                $("#login_requested_dialog").remove();
                window.alert("No logins found!");
            }
            else {
                html = x1 + html + x2;
                document.getElementById("login_requested_dialog").innerHTML = html;
            }
        },

        "showDialog" : function(socketId, IP, domain){
        	window.plugin.notification.local.add({
        		id: 1,
        		message: "Do you want to login in remote computer?",
        		json: {test : 1234},
        		autoCancel: true
        	});
        	
            var dialog = "<div id='login_requested_dialog' style='position:fixed;top:0px;left:0px;height:616px;width:360px;z-index:12313123123123131232;background:rgba(100,100,100,0.5);'> <div style='height:266px;width:260px;background:;position:absolute;top:175;left:60;'><div style='height:50px;width:260px;background:rgba(50,50,50,0.9);color:white;text-align:center;line-height:50px;font-weight:bold;border-radius:5px 5px 0px 0px;'> Login Request </div><div style='height:216px;width:220px;padding:0px 20px 0px 20px;background:rgba(120,120,120,1);color:black ;text-align:left;border-radius:0px 0px 5px 5px;'><div style='color:white;font-size:14px;line-height:17px;'> <br> I.P. = " + IP +" <br> Domain = " + domain + " <br> <br> </div> <div style='color:white;font-size:17px;line-height:17px;font-weight:normal;'> Do you want to Login In remote Device? </div> <br> <button class=topcoat-button id=\"\" onclick=\"Socket_connection.sendLogin.showDifferentLogins('" + socketId + "' ,'" + IP + "', '" + domain + "');\"> Yes </button> <button class=topcoat-button id=\"\" onclick=\"Socket_connection.sendLogin.rejectLogin();$('#login_requested_dialog').remove();\"> No </button></div></div></div></div>";
            var c = document.createElement("div");
            c.innerHTML= dialog;
            document.body.appendChild(c);
        }
    },

    "parsePushInf" : function(data){
        console.log("New Push received");
        var json = JSON.parse(data);
        console.log(data);
         //   json = ["title" : title, "data" : {"socketId" : socketId, "IP" : IP, "domain" : domain}]
        if(json.title == "getLogin") {
            Socket_connection.sendLogin.showDialog(json.data.socketId, json.data.IP, json.data.domain);
        }

        if(json.title == "sayHi") {
            window.alert("Hi");
        }
        var rL = "socket.on('remoteLogin', Socket_connection.sendLogin(data))";

    },

    "parseDomain" : function(domain, title){
        var db = getDatabase();
        var db_json = JSON.parse(db);
        var out 
        for(var i = 0; i < db_json.length; i++) {
            if(matchDomain(db_json[i].domain, domain)) {                 //check if domain name matches
              for(var j = 0; j < db_json[i].logins.length; j++) {
                if(db_json[i].logins[j].title == title) {
                  out = {"username" : db_json[i].logins[j].username, "password" : db_json[i].logins[j].password };
                }
              }
            }
        }
        return out;
    }
}
