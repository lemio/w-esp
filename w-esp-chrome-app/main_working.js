/*document.querySelector('button').addEventListener('click', function() {
  is_on = !is_on;
  //connection.send(is_on ? 'y' : 'n');
  text = $(".command").val();
  connection.send(text);
});*/
var buffer_string = "";
var p = 0;
$(".cloud").click(function() {
	$(".left_content").hide();
	$(".cloud_content").show();
});
$(".wifi").click(function() {
	$(".left_content").hide();
	$(".wifi_content").show();
});
$(".input").click(function() {
	$(".left_content").hide();
	$(".input_content").show();
});
$(".output").click(function() {
	$(".left_content").hide();
	$(".output_content").show();
});
var check_connection = function(){
	/*
0: STATION_IDLE,
1: STATION_CONNECTING,
2: STATION_WRONG_PASSWORD,
3: STATION_NO_AP_FOUND,
4: STATION_CONNECT_FAIL,
5: STATION_GOT_IP.
*/
	esp_exec("print(wifi.sta.status())");
}
$(".command").click(function() {
check_connection();
//esp_exec("print(wifi.sta.getip())");
});
$(".refresh").click(function(){
	esp_exec("file.open(\"ssid.lua\", \"r\")");
    esp_exec("print(file.readline())");
	$("#ssid").val(recieve_esp());
    esp_exec("print(file.readline())");
});
$(".settings").click(function() {
//esp_exec("wifi.setmode(wifi.STATION) wifi.sta.config(\"Wreetvilla\",\"yvadiva2\") ");

p=0;
  esp_exec("file.remove(\"ssid.lua\");");
  esp_exec("file.open(\"ssid.lua\",\"w+\");");
  esp_exec("w = file.writeline");
  esp_exec("w([[ssid=\""+$("#ssid").val()+"\"]]);");
  esp_exec("w([[password=\""+$("#password").val()+"\"]]);");
  esp_exec("file.close();");
});
var recieve_esp = function(){
setTimeout( function(){
if (buffer_string == ""){
	recieve_esp();
}else{
	buffer_string == "";
	return buffer_string;
} 
},50);
}
var esp_exec = function(input) {
setTimeout(
  function(esp_exec) 
  {
    connection.send(input + "\r\n");

  },p*300);
  p++;
  
}

const DEVICE_PATH = 'COM18';
const serial = chrome.serial;

/* Interprets an ArrayBuffer as UTF-8 encoded string data. */
var ab2str = function(buf) {
  var bufView = new Uint8Array(buf);
  var encodedString = String.fromCharCode.apply(null, bufView);
  return decodeURIComponent(escape(encodedString));
};

/* Converts a string to UTF-8 encoding in a Uint8Array; returns the array buffer. */
var str2ab = function(str) {
  var encodedString = unescape(encodeURIComponent(str));
  var bytes = new Uint8Array(encodedString.length);
  for (var i = 0; i < encodedString.length; ++i) {
    bytes[i] = encodedString.charCodeAt(i);
  }
  return bytes.buffer;
};

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

var SerialConnection = function() {
  this.connectionId = -1;
  this.lineBuffer = "";
  this.boundOnReceive = this.onReceive.bind(this);
  this.boundOnReceiveError = this.onReceiveError.bind(this);
  this.onConnect = new chrome.Event();
  this.onReadLine = new chrome.Event();
  this.onError = new chrome.Event();
};

SerialConnection.prototype.onConnectComplete = function(connectionInfo) {
  if (!connectionInfo) {
    log("Connection failed.");
    return;
  }
  this.connectionId = connectionInfo.connectionId;
  chrome.serial.onReceive.addListener(this.boundOnReceive);
  chrome.serial.onReceiveError.addListener(this.boundOnReceiveError);
  this.onConnect.dispatch();
};

SerialConnection.prototype.onReceive = function(receiveInfo) {
  if (receiveInfo.connectionId !== this.connectionId) {
    return;
  }

  this.lineBuffer += ab2str(receiveInfo.data);

  var index;
  while ((index = this.lineBuffer.indexOf('>')) >= 0) {
    var line = this.lineBuffer.substr(0, index + 1);
    this.onReadLine.dispatch(line);
    this.lineBuffer = this.lineBuffer.substr(index + 1);
  }
};

SerialConnection.prototype.onReceiveError = function(errorInfo) {
  if (errorInfo.connectionId === this.connectionId) {
    this.onError.dispatch(errorInfo.error);
  }
};

SerialConnection.prototype.connect = function(path) {
  serial.connect(path, this.onConnectComplete.bind(this))
};

SerialConnection.prototype.send = function(msg) {
  if (this.connectionId < 0) {
    throw 'Invalid connection';
  }
  serial.send(this.connectionId, str2ab(msg), function() {});
};

SerialConnection.prototype.disconnect = function() {
  if (this.connectionId < 0) {
    throw 'Invalid connection';
  }
  serial.disconnect(this.connectionId, function() {});
};

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

var connection = new SerialConnection();

connection.onConnect.addListener(function() {
  log('connected to: ' + DEVICE_PATH);
  //connection.send("hello arduino");
});

connection.onReadLine.addListener(function(line) {
  buffer_string = line;
  log('read line: ' + line);
});

connection.connect(DEVICE_PATH);

function log(msg) {
  var buffer = document.querySelector('#buffer');
  buffer.innerHTML += msg + '<br/>';
}

var is_on = false;


