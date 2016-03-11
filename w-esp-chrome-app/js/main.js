


//define chrome.serial to be serial (shorter)
const serial = chrome.serial;

var buffer_string = "";

//p is the amount of waiting messages to be sent (I made a delay of 300ms in between the messages)
var p = 0;

/*
Define the different status names from http://www.nodemcu.com/docs/wifi-sta-module/
*/
var status_names = ["STATION_IDLE",
    "STATION_CONNECTING",
    "STATION_WRONG_PASSWORD",
    "STATION_NO_AP_FOUND",
    "STATION_CONNECT_FAIL",
    "STATION_GOT_IP"
];

/*
When the Google chrome app gets a list of the Serial devices, add those to the serial port optionlist and try to connect to the first one
*/
var onGetDevices = function(ports) {
    for (var i = 0; i < ports.length; i++) {
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
/*
Bind this function to the chrome extension	
*/
chrome.serial.getDevices(onGetDevices);

/*
When the user changes the values of the wifi settings, the class '.wrong' shouldn't apply any longer (highlighted)
*/
$("#password, #ssid").change(function() {
    $(this).removeClass("wrong");
});




/*
When the user clicks on the settings icon with the class: '.settings'
Show the settings content and hide the others
*/
$(".settings").click(function() {
    $(".left_content").hide();
    $(".settings_content").show();
});
/*
When the user clicks on the devices icon with the class: '.devices'
Show the drag and drop devices and hide the other content
*/
$(".devices").click(function() {
    $(".left_content").hide();
    $(".devices_content").show();
});
/*
When the user clicks on the control icon with the class: '.control'
Generate a QR code for the mobile web-app and update the node-red startup code (in the textarea)
*/
$(".control").click(function() {
    url = $.url($("#web_socket_url").val());
    var host = url.attr('host');
    var path = url.attr('path');
    var port = $("#web_socket_port").val();
    var input = $(".mobile_1").children().data("type");
    var output = $(".mobile_2").children().data("type");
    $(".left_content").hide();
    $(".control_content textarea").val(export_to_node_red());
    $("#mobile_qr").empty().qrcode({
        "width": 100,
        "height": 100,
        "color": "#000000",
        "text": "http://lemio.nl/iot/w-esp.php?websocket=" + encodeURIComponent("ws://" + host + ":" + port + path) + "&i=" + input + "&a=" + output
    });
    $(".control_content").show();

});
document.addEventListener('DOMContentLoaded', function() {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function() {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function() {
                chrome.tabs.create({
                    active: true,
                    url: location
                });
            };
        })();
    }
});
/*
When the user clicks on the button to export to node-red
Copy the startup code from the textarea to the clipboard
And create a new chrome app window with the link in the settings tab
*/
$(".export-node-red").click(function() {
    url = $.url($("#web_socket_url").val());
    var host = url.attr('host');
    var path = url.attr('path');
    var port = $("#web_socket_port").val();
    var sandbox = $('#select-nodes').select();
    document.execCommand('copy');
    //sandbox.val('');
    document.execCommand('copy');
    var test = window.chrome.app.window.create('node-red.html?web=' + encodeURIComponent("http://" + host + ":" + port), {
        state: "maximized"
    }, function(createdWindow) {
        console.log(createdWindow);
        //createdWindow.getElementById("web").attr( "src", "http://lemio.nl/" );
    });


    //window.open('https://google.com', '_blank')
});

var check_connection = function() {
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
//Debug buttons (normally hidden)
$(".command").click(function() {
    check_connection();
    //esp_exec("print(wifi.sta.getip())");
});
$(".refresh").click(function() {
    esp_exec("readWifi()");
});
$(".connect").click(function() {
    esp_exec("connectWifi()");
});
/*
When the user clicks on the change settings button (for changing the server/port/path)	
*/
$(".websocket_settings").click(function() {
	//Extract the port host and path from the URL
    url = $.url($("#web_socket_url").val());
    var host = url.attr('host');
    var path = url.attr('path');
    $(".status_websocket").text("connecting...");
    var port = $("#web_socket_port").val();
	//Send the data to the ESP and try to start the connection
    esp_exec("changeConnection(\"" + host + "\",\"" + path + "\",\"" + port + "\") startConnection()");
});
/*
When the user clicks on the change settings button (for changing the WIFI ssid and password)	
*/
$(".settings").click(function() {
    p = 0;
	//Send this data to the ESP
    esp_exec("changeWifi(\"" + $("#ssid").val() + "\",\"" + $("#password").val() + "\") connectWifi()");
});
/*
Recieve a message from the w-esp ?
Find out what happens here, and why I programmed it this way? TODO	
*/
var recieve_esp = function() {
    setTimeout(function() {
        if (buffer_string == "") {
            recieve_esp();
        } else {
            buffer_string == "";
            return buffer_string;
        }
    }, 50);
}
/*
Send a string over the serial port to the w-esp	
*/
var esp_exec = function(input) {
    setTimeout(
        function(esp_exec) {
            connection.send(input + "\r\n");
        }, p * 300);
    p++;

}



/*
Create a new SerialConnection	
*/
var connection = new SerialConnection();
/*
When the chrome app connects to the w-esp	
*/
connection.onConnect.addListener(function() {
    $().toastmessage('showNoticeToast', "Connected");
	//Send three different commands to the w-esp, to read the wifi settings, read the device settings and read the connection settings
    esp_exec("readWifi()");
    esp_exec("getDevices()");
    esp_exec("readConnection()");
	//Check the connection every 5 seconds (to see if the w-esp is still up and running)
    setInterval(check_connection, 5000);
});
/*
Read the incoming data
*/
connection.onReadLine.addListener(function(line) {
    $(".setting_block_usb").addClass("setting_done");
    $(".status_usb").text("Connected");
    buffer_string = line;
    console.log(line);
	//Check it for all the possible commands/respones on queries
    check_for_ssid(line);
    check_for_password(line);
    check_for_status(line);
    check_for_websocket_connection(line);
    check_for_connection(line);
    check_for_devices(line);
    log('read line: ' + line);

});
/*
Check if there is a response that looks like a device response
*/
var check_for_devices = function(str) {
    var patt2 = /DEVICES&1&([\-]?[0-9])&2&([\-]?[0-9])&3&([\-]?[0-9])&4&([\-]?[0-9])&/g;
    result2 = patt2.exec(str);
    console.log(result2);
    if (result2 != null) {
        $(".port_0").empty();
        $(".port_1").empty();
        $(".port_2").empty();
        $(".port_3").empty();
        $("#t" + result2[1]).clone().appendTo(".port_0"); //.css("position","initial");
        $("#t" + result2[2]).clone().appendTo(".port_1"); //.css("position","initial");
        $("#t" + result2[3]).clone().appendTo(".port_2"); //.css("position","initial");
        $("#t" + result2[4]).clone().appendTo(".port_3"); //.css("position","initial");

        $().toastmessage('showNoticeToast', "Got the port settings");
    }
}
/*
Check if there is a response that looks like a wifi config response
*/
var check_for_ssid = function(str) {
    var patt2 = /SSID&(.*)&PASS&(.*)/g;
    result2 = patt2.exec(str);
    if (result2 != null) {
        $(".status_usb").text("Connection verified");
        $("#ssid").val(result2[1]);
        $("#password").val(result2[2]);
        $().toastmessage('showNoticeToast', "SSID: " + result2[1] + "<br />PASSWORD: " + result2[2]);
    }
}
/*
Check if there is a response that looks like a connection config response
*/
var check_for_websocket_connection = function(str) {
    var patt2 = /HOST\&(.*)\&PATH\&(.*)\&PORT\&(.*)/m;
    result2 = patt2.exec(str);
    if (result2 != null) {
        $(".status_usb").text("Connection verified");
        $("#web_socket_url").val(result2[1] + result2[2]);
        $("#web_socket_port").val(result2[3]);
        // $().toastmessage('showNoticeToast', "SSID: " + result2[1] + "<br />PASSWORD: " + result2[2]);
    }
}
/*
Check if there is a response that looks like a pong response from the server, 'kept_alive'
*/
var check_for_connection = function(str) {
    var patt2 = /kept_alive/g
    result2 = patt2.exec(str);
    if (result2 != null) {
        $(".status_usb").text("Connection verified");
        $(".status_websocket").text("Connected to node-RED!");
        $(".setting_block_web").addClass("setting_done");
        $(".setting_block_wifi").addClass("setting_done");
        $(".setting_block_usb").addClass("setting_done");
    }
}
/*
Check if there is a response that looks like a statuscode update from the w-esp
*/
var check_for_status = function(str) {
    var patt2 = /STATUSCODE([0-5])&&(.*)/m;
    result2 = patt2.exec(str);
    if (result2 != null) {
        $(".status_usb").text("Connection verified");
        /*"STATION_IDLE",
"STATION_CONNECTING",
"STATION_WRONG_PASSWORD",
"STATION_NO_AP_FOUND",
"STATION_CONNECT_FAIL",
"STATION_GOT_IP"*/
        console.log(result2[1]);
        switch (result2[1]) {
            case "0":
                $(".status_wifi").text("Wifi connection is inactive.");
                break;
            case "1":
                $(".status_wifi").text("Connecting...");
                $(".setting_block_wifi").removeClass("setting_done");
                $(".setting_block_web").removeClass("setting_done");

                break;
            case "2":
                $(".status_wifi").text("Wrong password.");
                $("#password").addClass("wrong");
                $(".setting_block_wifi").removeClass("setting_done");
                $(".setting_block_web").removeClass("setting_done");
                break;
            case "3":
                $(".status_wifi").text("Network could not be found.");
                $("#ssid").addClass("wrong");
                $(".setting_block_wifi").removeClass("setting_done");
                $(".setting_block_web").removeClass("setting_done");
                break;
            case "4":
                $(".status_wifi").text("Connetion failed.");
                break;
            case "5":
                $("*").removeClass("wrong");
                $(".setting_block_wifi").addClass("setting_done");
                $(".setting_block_usb").addClass("setting_done");
                $(".status_wifi").text("Connected to wifi network.");
                break;
            default:
                $().toastmessage('showNoticeToast', "Unexpected message");
                break;
        }
        $().toastmessage('showNoticeToast', "Status: " + status_names[result2[1]] + " heap: " + result2[2]);
    }
}
/*
		The log function, to show the logged data (for debug mode)
*/
function log(msg) {
    var buffer = document.querySelector('#buffer');
    buffer.innerHTML += msg + '<br/>';
}

/*
All the drag and drop interface shizzle
*/
$(".tool_sensor, .tool_actuator").draggable({
    revert: true
});
$(".tool_mobile").draggable({
    revert: true
});
$(".input_field").droppable({
    accept: ".tool_sensor, .tool_actuator",
    activeClass: "input_active",
    hoverClass: "input_hover",
    drop: function(event, ui) {
        $(this)
            .addClass("input_drop");
        $(this).empty();
        $(ui.draggable).clone().appendTo(this).css("position", "initial");
        var deviceType = $(ui.draggable).data("type");
        var port = $(this).data("port");
        esp_exec("addDevice(" + port + "," + deviceType + ")");
        $().toastmessage('showNoticeToast', "DROP: " + $(ui.draggable).data("type") + "&&" + $(this).data("port"));
    }
});
$(".mobile_input").droppable({
    accept: ".tool_mobile",
    activeClass: "input_active",
    hoverClass: "input_hover",
    drop: function(event, ui) {
        $(this)
            .addClass("input_drop");
        $(this).empty();
        $(ui.draggable).clone().appendTo(this).css("position", "initial");
        var deviceType = $(ui.draggable).data("type");
        var port = $(this).data("port");
        $().toastmessage('showNoticeToast', "DROP: " + $(ui.draggable).data("type") + "&&" + $(this).data("port"));
    }
});
$(".mobile_input").mousedown(function() {
    var port = $(this).data("port");
    var deviceType = $(this).children().data("type");
    $().toastmessage('showNoticeToast', "REMOVE: " + port + deviceType);
    $(this).empty().removeClass("input_drop");
});

$(".accept_digital").droppable("option", "accept", ".tool_digital");
$(".accept_mobile").droppable("option", "accept", ".tool_mobile");

$(".input_field").mousedown(function() {
    var port = $(this).data("port");
    var deviceType = $(this).children().data("type");
    $().toastmessage('showNoticeToast', "REMOVE: " + port + deviceType);
    esp_exec("deleteDevice(" + port + "," + deviceType + ")");
    $(this).empty().removeClass("input_drop");
});
$(function() {
    var pop = function() {
        $('#screen').css({
            opacity: 0.7,
            "width": $(document).width(),
            "height": $(document).height()
        });
        $('body').css({
            "overflow": "hidden"
        });
        $('#box').css({
            'display': 'block'
        });
    }
    $("#button").click(pop);
});
chrome.app.window.onClosed.addListener(function() {
    SerialConnection.prototype.disconnect();
})