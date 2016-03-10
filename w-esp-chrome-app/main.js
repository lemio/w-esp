/*document.querySelector('button').addEventListener('click', function() {
  is_on = !is_on;
  //connection.send(is_on ? 'y' : 'n');
  text = $(".command").val();
  connection.send(text);
});*/

$(document).ready(function() {
  $('.rotate').css('height', $('.rotate').width());
});


var status_names = ["STATION_IDLE",
"STATION_CONNECTING",
"STATION_WRONG_PASSWORD",
"STATION_NO_AP_FOUND",
"STATION_CONNECT_FAIL",
"STATION_GOT_IP"];

const serial = chrome.serial;
var onGetDevices = function(ports) {
  for (var i=0; i<ports.length; i++) {
	$("#serial_ports").append($('<option>', {
    value: ports[i].path,
    text: ports[i].path
}));
    console.log(ports[i].path);
	console.log(ports[i].displayName)
  }
  const DEVICE_PATH = ports[0].path;
  connection.connect(DEVICE_PATH);
}
chrome.serial.getDevices(onGetDevices);
$("#password, #ssid").change(function(){
	$(this).removeClass("wrong");
});
var buffer_string = "";
var p = 0;
$(".usb").click(function() {
	$(".left_content").hide();
	$(".usb_content").show();
});
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
	url = $.url($("#web_socket_url").val());
	var host = url.attr('host');
	var path = url.attr('path');
	var port = $("#web_socket_port").val();
	var input = $(".mobile_1").children().data("type");
	var output = $(".mobile_2").children().data("type");
	$(".left_content").hide();
	$(".output_content textarea").val(export_to_node_red());
	$("#mobile_qr").empty().qrcode({
    "width": 100,
    "height": 100,
    "color": "#000000",
    "text": "http://lemio.nl/iot/w-esp.php?websocket=" + encodeURIComponent("ws://" + host + ":" + port + path) + "&i=" + input + "&a=" + output
});
	$(".output_content").show();
	
});
document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
});
$(".export-node-red").click(function (){
	url = $.url($("#web_socket_url").val());
	var host = url.attr('host');
	var path = url.attr('path');
	var port = $("#web_socket_port").val();
	var sandbox = $('#select-nodes').select();
    document.execCommand('copy');
    //sandbox.val('');
	document.execCommand('copy');
	var test = window.chrome.app.window.create('node-red.html?web='+encodeURIComponent("http://"+host +":"+port), {state: "maximized" },function (createdWindow){
		console.log(createdWindow);
		//createdWindow.getElementById("web").attr( "src", "http://lemio.nl/" );
	});
	
	
	//window.open('https://google.com', '_blank')
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
	esp_exec("print(\"STATUSCODE\" .. wifi.sta.status() .. \"&&\" .. node.heap())");
}
$(".node-red").click(function() {
	esp_exec("startConnection();");
});
$(".command").click(function() {
check_connection();
//esp_exec("print(wifi.sta.getip())");
});
$(".refresh").click(function(){
	esp_exec("readWifi()");
});
$(".connect").click(function(){
	esp_exec("connectWifi()");
});
$(".websocket_settings").click(function() {
	url = $.url($("#web_socket_url").val());
	var host = url.attr('host');
	var path = url.attr('path');
	$(".status_websocket").text("connecting...");
	var port = $("#web_socket_port").val();
	esp_exec("changeConnection(\"" + host + "\",\"" + path + "\",\"" + port + "\") startConnection()");
});

$(".settings").click(function() {
//esp_exec("wifi.setmode(wifi.STATION) wifi.sta.config(\"Wreetvilla\",\"yvadiva2\") ");
	p=0;
	esp_exec("changeWifi(\""+$("#ssid").val()+"\",\""+$("#password").val()+"\") connectWifi()");
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



/* Interprets an ArrayBuffer as UTF-8 encoded string data. */


////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

var connection = new SerialConnection();

connection.onConnect.addListener(function() {
  //log('connected to: ' + DEVICE_PATH);
  $().toastmessage('showNoticeToast', "Connected");
  //connection.send("hello arduino");
  //esp_exec("dofile(\"start.lua\")");
  esp_exec("readWifi()");
  esp_exec("getDevices()");
  esp_exec("readConnection()");
  setInterval(check_connection,5000);
});

connection.onReadLine.addListener(function(line) {
	$(".setting_block_usb").addClass("setting_done");
	$(".status_usb").text("Connected");
  buffer_string = line;
  console.log(line);
  check_for_ssid(line);
  check_for_password(line);
  check_for_status(line);
  check_for_websocket_connection(line);
  check_for_connection(line);
  check_for_devices(line);
  log('read line: ' + line);
 
});
var check_for_devices = function(str){
	var patt2 = /DEVICES&1&([\-]?[0-9])&2&([\-]?[0-9])&3&([\-]?[0-9])&4&([\-]?[0-9])&/g;
    result2 = patt2.exec(str);
	console.log(result2);
	if (result2 != null){
	$(".port_0").empty();
	$(".port_1").empty();
	$(".port_2").empty();
	$(".port_3").empty();
	$( "#t" + result2[1] ).clone().appendTo( ".port_0" );//.css("position","initial");
	$( "#t" + result2[2] ).clone().appendTo( ".port_1" );//.css("position","initial");
	$( "#t" + result2[3] ).clone().appendTo( ".port_2" );//.css("position","initial");
	$( "#t" + result2[4] ).clone().appendTo( ".port_3" );//.css("position","initial");
	
	 $().toastmessage('showNoticeToast', "Got the port settings");
	}
}
var check_for_ssid = function(str){
	var patt2 = /SSID&(.*)&PASS&(.*)/g;
    result2 = patt2.exec(str);
	if (result2 != null){
	$(".status_usb").text("Connection verified");
	$("#ssid").val(result2[1]);
	$("#password").val(result2[2]);
	 $().toastmessage('showNoticeToast', "SSID: " + result2[1] + "<br />PASSWORD: " + result2[2]);
	}
}
var check_for_websocket_connection = function(str){
	var patt2 = /HOST\&(.*)\&PATH\&(.*)\&PORT\&(.*)/m;
    result2 = patt2.exec(str);
	if (result2 != null){
	$(".status_usb").text("Connection verified");
	$("#web_socket_url").val(result2[1]+result2[2]);
	$("#web_socket_port").val(result2[3]);
	// $().toastmessage('showNoticeToast', "SSID: " + result2[1] + "<br />PASSWORD: " + result2[2]);
	}
}
var check_for_connection = function(str){
	var patt2 = /kept_alive/g
	result2 = patt2.exec(str);
	if (result2 != null){
		$(".status_usb").text("Connection verified");
		$(".status_websocket").text("Connected to node-RED!");
		$(".setting_block_web").addClass("setting_done");
		$(".setting_block_wifi").addClass("setting_done");
		$(".setting_block_usb").addClass("setting_done");
	}
}
var check_for_password = function(str){
	var patt2 = /password=\"(.*)\"/g;
    result2 = patt2.exec(str);
	if (result2 != null){
	$(".status_usb").text("Connection verified");
	$("#password").val(result2[1]);
	$().toastmessage('showNoticeToast', "Password: " + result2[1]);
	}
}
var check_for_status = function(str){
	var patt2 = /STATUSCODE([0-5])&&(.*)/m;
    result2 = patt2.exec(str);
	if (result2 != null){
		$(".status_usb").text("Connection verified");
	/*"STATION_IDLE",
"STATION_CONNECTING",
"STATION_WRONG_PASSWORD",
"STATION_NO_AP_FOUND",
"STATION_CONNECT_FAIL",
"STATION_GOT_IP"*/
	console.log(result2[1]);
	switch( result2[1]){
		case "0":
			$(".status_wifi").text( "Wifi connection is inactive." );
		break;
		case "1":
			$(".status_wifi").text( "Connecting..." );
			$(".setting_block_wifi").removeClass("setting_done");
			$(".setting_block_web").removeClass("setting_done");

		break;
		case "2":
			$(".status_wifi").text( "Wrong password." );
			$("#password").addClass("wrong");
			$(".setting_block_wifi").removeClass("setting_done");
			$(".setting_block_web").removeClass("setting_done");
		break;
		case "3":
			$(".status_wifi").text( "Network could not be found." );
			$("#ssid").addClass("wrong");
			$(".setting_block_wifi").removeClass("setting_done");
			$(".setting_block_web").removeClass("setting_done");
		break;
		case "4":
			$(".status_wifi").text( "Connetion failed." );
		break;
		case "5":
			$("*").removeClass("wrong");
			$(".setting_block_wifi").addClass("setting_done");
			$(".setting_block_usb").addClass("setting_done");
			$(".status_wifi").text( "Connected to wifi network." );
		break;
		default:
			$().toastmessage('showNoticeToast', "Unexpected message");
		break;
	}
	$().toastmessage('showNoticeToast', "Status: " + status_names[result2[1]] + " heap: " + result2[2]);
}
}

function log(msg) {
  var buffer = document.querySelector('#buffer');
  buffer.innerHTML += msg + '<br/>';
}

var is_on = false;

$( ".tool_sensor, .tool_actuator" ).draggable({
revert: true

/*
start: function( event, ui ) {
	$(".input_field").css("fill","red");
},
stop: function( event, ui ) {
	$(".input_field").css("fill","blue");
}*/
});
$( ".tool_mobile" ).draggable({
revert: true

/*
start: function( event, ui ) {
	$(".input_field").css("fill","red");
},
stop: function( event, ui ) {
	$(".input_field").css("fill","blue");
}*/
});
$(".input_field").droppable({
	accept: ".tool_sensor, .tool_actuator",
    activeClass: "input_active",
      hoverClass: "input_hover",
      drop: function( event, ui ) {
			$( this )
          .addClass( "input_drop" );
		  $(this).empty();
		  $( ui.draggable ).clone().appendTo( this ).css("position","initial");
			var deviceType = $( ui.draggable ).data("type");
			var port = $(this).data("port");
			esp_exec("addDevice("+port+","+deviceType+")");
			$().toastmessage('showNoticeToast', "DROP: " + $( ui.draggable ).data("type") + "&&" + $(this).data("port"));
      }
	  }
	);
$(".mobile_input").droppable({
	accept: ".tool_mobile",
    activeClass: "input_active",
      hoverClass: "input_hover",
      drop: function( event, ui ) {
			$( this )
          .addClass( "input_drop" );
		  $(this).empty();
		  $( ui.draggable ).clone().appendTo( this ).css("position","initial");
			var deviceType = $( ui.draggable ).data("type");
			var port = $(this).data("port");
			$().toastmessage('showNoticeToast', "DROP: " + $( ui.draggable ).data("type") + "&&" + $(this).data("port"));
      }
	  }
	);
$(".mobile_input").mousedown( function() {
	var port = $(this).data("port");
	var deviceType = $(this).children().data("type");
	$().toastmessage('showNoticeToast', "REMOVE: " + port + deviceType);	
	$(this).empty().removeClass( "input_drop" );
});

	$( ".accept_digital" ).droppable( "option", "accept", ".tool_digital" );
	$( ".accept_mobile" ).droppable( "option", "accept", ".tool_mobile" );

$(".input_field").mousedown( function() {
	var port = $(this).data("port");
	var deviceType = $(this).children().data("type");
	$().toastmessage('showNoticeToast', "REMOVE: " + port + deviceType);	
	esp_exec("deleteDevice("+port+","+deviceType+")");
	$(this).empty().removeClass( "input_drop" );
});
$(function(){
	var pop = function(){
	    $('#screen').css({ opacity: 0.7, "width":$(document).width(),"height":$(document).height()});
	    $('body').css({"overflow":"hidden"});
	    $('#box').css({'display': 'block'});
	}
	$("#button").click(pop);
	});
chrome.app.window.onClosed.addListener(function (){
	SerialConnection.prototype.disconnect();
})