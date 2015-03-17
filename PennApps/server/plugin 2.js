
/***************************************************************************************/
var d = document;
var getEl = "getElementById";
var getType = "getElementsByType";
var getTag = "getElementsByTagName";
var getCl = "getElementsByClassName";
var socket;
var host = "https://localhost:8080"

/***********************************************************/
	//include socket.io file
var sc = document.createElement("script");
sc.src = host + "/socket.io/socket.io.js";
document.body.appendChild(sc);
	/************************************************************/

var scanInput = function(key, val) {  //scan input by key = "id" and val = "username"
	var input = d[getTag]("input");
	var inputLength = input.length;

	for(var i = 0; i < inputLength; i++) {
		if(input[i][key] == val) {
			console.log("'" + val + "' field found at input[" + i + "]");
			return input[i];
		}
	}
	console.log("'" + val + "' field not found");
}

var fillForm = function(key, val, data){
	var input = scanInput(key, val);
	input.value = data;
	return true;
}


var findSubmit = function() {
	var submitInput = scanInput("type", "submit");
}

var submitLogins = function() {
	scanInput("type", "submit").click();
}


var completeLogin = function(user, pass, data, method) {
	method = method || "post"; 

	var json_data = JSON.parse(data);
	var params = {"email" : json_data.data["username"], "password" : json_data.data["password"]};
	var form = document.createElement("form");
	//form.style.display = "none";
	form.setAttribute("method", method);
	form.setAttribute("action", document.forms[0].action);

	form.innerHTML = document.forms[0].innerHTML;

	var input = d[getTag]("input");
	var inputLength = input.length;

	var textIn = scanInput("type", "text");
	var emailIn = scanInput("type", "email");
	var passIn = scanInput("type", "password");

	if(textIn) {
		form[textIn.name].value = params["email"];
		console.log("text filled");
	}

	if (emailIn) {
		form[emailIn.name].value = params["email"];
		console.log("email filled");
	}

	if (passIn) {
		form[passIn.name].value = params["password"];
		console.log("password filled");
	}
	document.body.appendChild(form);
	form.submit();
}

/**************************************************************************************/


function SmartLogin_send_request(details) {
  socket.emit('site', details);			//request for login details
}

function SmartLogin_request_login(ev){
	var user = document.getElementById("smartUserId").value;
	if(user) {
		var details = '{"username" : "' + user +'", "domain" : "' + location.host + '"}';
		SmartLogin_send_request(details);
	}
	else {
		document.getElementById("SmartLogin_input_error").innerHTML = "Please enter your Smart Login Username."
	}
}

var SmartLogin_conn_init = function(){
	var x = 'socket.emit(\'server-resp\', \'{"username": "\'+ logins.SmartUser +\'", "message" : "Remote Device received Logins."}\')';
	eval(""+
		"socket = io.connect(host);" +
		"socket.on('server', function (data) {"+
			"console.log(data);"+
			"parseLogins(data)"+
			"});"
	);
}

var parseLogins = function(data){
	var json = JSON.parse(data);
	if(json.title = "loginInf") {
		document.getElementById("loginPopup").remove();
		var user = json.data.username;
		var pass = json.data.password;
		completeLogin(user, pass, data);
	}
	else if(json.title == "error") {
		document.getElementById('SmartLogin_input_error').innerHTML = json.data.msg;
	}
}

var init_timeOut = function() {
	setTimeout(function(){
		if(window.io){
			SmartLogin_conn_init();
		}
		else {
			init_timeOut();
		}
	},100);
}
init_timeOut();


/*******************************************************************/
var SmartLogin_check_loginPage = function() {
	if(scanInput("type", "password")) {
		SmartLogin_display_input();
	}
}

var SmartLogin_display_input = function() {
	var div = document.createElement("div");
	div.id="loginPopup";
	div.style.height = "";
	div.style.width = "300px";
	div.style.display= "block";
	div.style.padding = "12px 0px 12px 13px"
	div.style.position = "fixed";
	div.style.top = "10px";
	div.style.borderRadius="10px";
	div.style.right = "20px";
	div.style.background = "rgba(80,80,80,0.7)";
		//div.style.background = "rgb(230,230,230)";
		div.style.zIndex = "11111";
		div.addEventListener("click",function(event){if(event.target.id == "loginPopup")this.remove();},true);


		var innerDiv = document.createElement("div");
		innerDiv.id="loginMenu";
		innerDiv.innerHTML = "<form method=\"\" action=\"javascript:SmartLogin_request_login();\" ><input placeholder=\"Smart User\" style=\"border:0px;position:absolute;left:0px;width:160px;border-radius:5px;padding:5px 10px 5px 10px;font-weight:bold;font-size:20px;line-height:25px;\" type=\"text\" id=\"smartUserId\" onclick=\"document.getElementById(\'SmartLogin_input_error\').innerHTML=\' \';\" autofocus> <input style=\"position:absolute;left:190px;top:0px;border:1px solid #777777;border-radius:5px;background:#6e9e2d;padding:5px 10px 5px 10px;font-weight:bold;font-size:25px;line-height:20px;\" type=\"submit\" value=\"LogIn\" onsubmit=\"SmartLogin_request_login(ev);\"> </form>   <div id=\"SmartLogin_input_error\" style=\"width:300px;height:10px;position:absolute;top:50px;left:0px;font-size:14px;color:red;text-align:center;\"></div>";
		innerDiv.style.height = "36px";
		innerDiv.style.width = "100px";
		innerDiv.style.position = "relative";
		innerDiv.style.top = "0px";
		var w = (window.innerWidth- 400) / 2;
		innerDiv.style.left = "0px";
		innerDiv.style.background = "";
		innerDiv.style.display= "block";
		innerDiv.style.zIndex = "111111";
		innerDiv.style.padding = "0px 0px 0px 10px"
		
		div.appendChild(innerDiv);
		document.body.appendChild(div);
	}
	

	SmartLogin_check_loginPage();
	/*****************************************************************/
	/**************************************************************************************/
