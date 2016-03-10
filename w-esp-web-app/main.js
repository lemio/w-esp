$.urlParam = function(name){
var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
if (results==null){
return null;
}else{
return results[1] || 0;
}	
}
$( document ).ready(function() {
    switch ($.urlParam("i")){
		case "P":
		$("#pushbutton").show();
		break;
		case "S":
		$("#switch").show();
		break;
		case "X":
		case "Y":
		setInterval(function(){ ws.send(send_values)}, 1000);
		break;
	}
	send_values = 0;
});
$("#pushbutton").click( function(){
	ws.send("P01");
});
$("#switch").change( function(){
if ($(this).is(':checked')){
	ws.send("S01");
}else{
	ws.send("S00");
}
	
});

var ws = new ReconnectingWebSocket(decodeURIComponent($.urlParam("websocket")));
ws.onopen = function()
     {
        // Web Socket is connected, send data using send()
       //alert("verbonden");
		console.log("verbonden");
	   $(".stat").text("verbonden");
     };
     ws.onmessage = function (evt) 
     { /*
        var received_msg = evt.data;
		document.body.style.backgroundColor = evt.data;*/
		eval(evt.data);
		console.log("data");
		//alert(evt.data);
		//
       /* alert("Message is received...");*/
	   $(".stat").text("bericht ontvangen");
     };
     ws.onclose = function()
     { 
        // websocket is closed.
        //alert("Connection is closed..."); 
		console.log("verbroken");
		$(".stat").text("verbinding verbroken");

     };
if (window.DeviceOrientationEvent) {
  // Listen for the deviceorientation event and handle the raw data
  window.addEventListener('deviceorientation', function(eventData) {
	switch ($.urlParam("i")){
		case 'X':
		send_values = "X0" + Math.floor(eventData.beta);
		break ;
		case 'Y':
		send_values = "X0" + Math.floor(eventData.gamma);
		break;
	  }
    // call our orientation event handler
  }, false);
} else {
}