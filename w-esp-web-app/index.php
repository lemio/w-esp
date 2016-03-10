<?
session_start();
if (isset($_GET["mobile"])){
$_SESSION["mobile"] = $_GET["mobile"];
$_SESSION["group"] = $_GET["group"];
}
?>
<!DOCTYPE html>
<html>

<head>
    <title>NodeRed</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" />
    <script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
    <script src="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
	<script src="reconnecting.js"></script>
</head>

<body>
<div data-role="page" id="home">
<div data-role="header"><h2>NodeRed App</h2><br /><h3>G: <? echo $_SESSION["group"] ?> M: <? echo $_SESSION["mobile"] ?> <span class="stat"></span></h3></div>
    <div role="main" class="ui-content">
		<form action="index.php" method="get">
        <select name="group">
			<option value="1"<?if ($_SESSION["group"] == 1){echo " selected=\"selected\" ";}?>>Groep 1</option>
			<option value="2"<?if ($_SESSION["group"] == 2){echo " selected=\"selected\" ";}?>>Groep 2</option>
			<option value="3"<?if ($_SESSION["group"] == 3){echo " selected=\"selected\" ";}?>>Groep 3</option>
			<option value="4"<?if ($_SESSION["group"] == 4){echo " selected=\"selected\" ";}?>>Groep 4</option>
		</select>
		<select name="mobile">
			<option value="1"<?if ($_SESSION["mobile"] == 1){echo " selected=\"selected\" ";}?>>Mobiel 1</option>
			<option value="2"<?if ($_SESSION["mobile"] == 2){echo " selected=\"selected\" ";}?>>Mobiel 2</option>
			<option value="3"<?if ($_SESSION["mobile"] == 3){echo " selected=\"selected\" ";}?>>Mobiel 3</option>
			<option value="4"<?if ($_SESSION["mobile"] == 4){echo " selected=\"selected\" ";}?>>Mobiel 4</option>
			<option value="5"<?if ($_SESSION["mobile"] == 5){echo " selected=\"selected\" ";}?>>Mobiel 5</option>
		</select>
		<input type="submit" value="kiezen" />
		</form>
    </div>
    <div data-role="footer">
        <div data-role="navbar">
            <ul>
                <li><a href="index.php?mobile=<?echo $_SESSION["mobile"]?>&group=<?echo $_SESSION["group"]?>#home" class="ui-btn-active">Home</a></li>
                <li><a href="index.php?mobile=<?echo $_SESSION["mobile"]?>&group=<?echo $_SESSION["group"]?>#acc">Acceleratie</a></li>
                <li><a href="index.php?mobile=<?echo $_SESSION["mobile"]?>&group=<?echo $_SESSION["group"]?>#sound">Geluid</a></li>
            </ul>
        </div>
    </div>
</div>
<div data-role="page" id="acc">
    <div data-role="header"><h2>NodeRed App<span class="stat"></span></h2></div>
    <div role="main" class="ui-content">
        <form>
			<!--
            <fieldset data-role="controlgroup" data-type="horizontal">
                <input type="radio" name="radio-choice-h-2" id="radio-choice-h-2a" value="on" checked="checked">
                <label for="radio-choice-h-2a">Uit</label>
                <input type="radio" name="radio-choice-h-2" id="radio-choice-h-2b" value="off" >
                <label for="radio-choice-h-2b">Manueel</label>
                <input type="radio" name="radio-choice-h-2" id="radio-choice-h-2c" value="other" >
                <label for="radio-choice-h-2c">Live</label>
            </fieldset>-->
			<div class="acc_enabled"></div>
            <label for="x-acc">X acceleratie:</label>
            <input type="range" name="x-acc" id="slider-x-acc" min="-100" max="100" value="50" data-popup-enabled="true" />
            <label for="y-acc">Y acceleratie:</label>
            <input type="range" name="y-acc" id="slider-y-acc" min="-100" max="100" value="50" data-popup-enabled="true" />
			<label for="z-acc">Z acceleratie:</label>
            <input type="range" name="z-acc" id="slider-z-acc" min="-100" max="100" value="50" data-popup-enabled="true" />
        </form>
    </div>
    <div data-role="footer">
        <div data-role="navbar">
            <ul>
                <li><a href="index.php?mobile=<?echo $_SESSION["mobile"]?>&group=<?echo $_SESSION["group"]?>#home">Home</a></li>
                <li><a href="index.php?mobile=<?echo $_SESSION["mobile"]?>&group=<?echo $_SESSION["group"]?>#acc" class="ui-btn-active">Acceleratie</a></li>
                <li><a href="index.php?mobile=<?echo $_SESSION["mobile"]?>&group=<?echo $_SESSION["group"]?>#sound">Geluid</a></li>
            </ul>
        </div>
    </div>
</div>
<div data-role="page" id="sound">
    <div data-role="header"><h2>NodeRed App<span class="stat"></span></h2></div>
    <div role="main" class="ui-content">
        <form>
			<!--
            <fieldset data-role="controlgroup" data-type="horizontal">
                <input class="radio-choice-h-2" type="radio" name="radio-choice-h-2" id="radio-choice-h-2a" value="on" checked="checked">
                <label for="radio-choice-h-2a">Uit</label>
                <input class="radio-choice-h-2" type="radio" name="radio-choice-h-2" id="radio-choice-h-2b" value="off" style=>
                <label for="radio-choice-h-2b">Manueel</label>
                <input class="radio-choice-h-2" type="radio" name="radio-choice-h-2" id="radio-choice-h-2c" value="other" style=>
                <label for="radio-choice-h-2c">Live</label>
            </fieldset>-->
            <label for="x-acc">Frequentie:</label>
            <input type="range" name="x-acc" id="slider-1" min="0" max="100" value="50" data-popup-enabled="true" />
            <label for="y-acc">Volume:</label>
            <input type="range" name="" id="slider-sound-vol" min="0" max="100" value="50" data-popup-enabled="true" />
        </form>
    </div>
    <div data-role="footer">
        <div data-role="navbar">
            <ul>
<li>
				<a href="index.php?mobile=<?echo $_SESSION["mobile"]?>&group=<?echo $_SESSION["group"]?>#home">Home</a></li>
                <li><a href="index.php?mobile=<?echo $_SESSION["mobile"]?>&group=<?echo $_SESSION["group"]?>#acc">Acceleratie</a></li>
                <li><a href="index.php?mobile=<?echo $_SESSION["mobile"]?>&group=<?echo $_SESSION["group"]?>#sound" class="ui-btn-active">Geluid</a></li>
            </ul>
        </div>
    </div>
</div>
<script type="text/javascript">
  navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate || null;
  <? if ($_SESSION["group"] != NULL){ ?>
  init_acc();
  var send_values = "";
  /*
  $(document).on("pagechange", function (e, data) {
    switch (data.toPage[0].id){
		case "acc":
		
		navigator.vibrate(100);
		break;
	}
	alert();
});*/
	var ws = new ReconnectingWebSocket("ws://<?php
	echo "designiot".$_SESSION["group"].".mybluemix.net/ws/groep" . $_SESSION["mobile"];
?>");
	
     ws.onopen = function()
     {
        // Web Socket is connected, send data using send()
       //alert("verbonden"); 
	   $(".stat").text("verbonden");
     };
     ws.onmessage = function (evt) 
     { /*
        var received_msg = evt.data;
		document.body.style.backgroundColor = evt.data;*/
		eval(evt.data);
		//alert(evt.data);
		//
       /* alert("Message is received...");*/
	   $(".stat").text("bericht ontvangen");
     };
     ws.onclose = function()
     { 
        // websocket is closed.
        //alert("Connection is closed..."); 
		$(".stat").text("verbinding verbroken");

     };
 
    function init_acc() {
      if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
	      //setInterval(function(){ ws.send($("#slider-x-acc").slider("value") + " " ws.send($("#slider-y-acc").slider("value") + " " + ws.send($("#slider-z-acc").slider("value"))}, 500);
			      setInterval(function(){ ws.send(send_values)}, 1000);
				  //$(".stat").text() = "verzonden";
        window.addEventListener('devicemotion', deviceMotionHandler, false);
		$(".acc_enabled").text("Acceleratie sensor gevonden");
      } else {
        $(".acc_enabled").text("Geen acceleratie sensor :(");
      }
    }
    
    function deviceMotionHandler(eventData) {
      var info, xyz = "[X, Y, Z]";
	/*
      // Grab the acceleration including gravity from the results
      var acceleration = eventData.acceleration;
      info = xyz.replace("X", round(acceleration.x));
      info = info.replace("Y", round(acceleration.y));
      info = info.replace("Z", round(acceleration.z));
      document.getElementById("moAccel").innerHTML = info;
*/
      // Grab the acceleration including gravity from the results
      acceleration = eventData.accelerationIncludingGravity;
	  //ws.send(round(acceleration.y));
	  /*
      info = xyz.replace("X", round(acceleration.x));
      info = info.replace("Y", round(acceleration.y));
      info = info.replace("Z", round(acceleration.z));*/
	   $("#slider-x-acc").val(round_10(acceleration.x)).slider("refresh");
	   $("#slider-y-acc").val(round_10(acceleration.y)).slider("refresh");
	   $("#slider-z-acc").val(round_10(acceleration.z)).slider("refresh");
	       send_values = round_10(acceleration.x) + " " + round_10(acceleration.y) + " " + round_10(acceleration.z);

	  //ws.send(round(acceleration.y));
      // Grab the acceleration including gravity from the results
	  /*
      var rotation = eventData.rotationRate;
      info = xyz.replace("X", round(rotation.alpha));
      info = info.replace("Y", round(rotation.beta));
      info = info.replace("Z", round(rotation.gamma));
      document.getElementById("moRotation").innerHTML = info;

      info = eventData.interval;
      document.getElementById("moInterval").innerHTML = info;*/
    }
    function round_10(val) {
      var amt = 10;
      return Math.round(val * amt);
    }
var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH=500;
var HEIGHT=50;
var rafID = null;

window.onload = function() {

    // grab our canvas
	
    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

}


function didntGetStream() {
    //alert('Stream generation failed.');
}

var mediaStreamSource = null;

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);
	setInterval(drawLoop,500);
    // kick off the visual updating
    
}

function drawLoop( time ) {
    // clear the background
    

    
    // draw a bar based on the current volume
	$("slider-sound-vol").val(meter.volume).slider("refresh");
    }
<?}?>
  </script>
</body>

</html>