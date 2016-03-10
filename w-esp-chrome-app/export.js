var export_to_node_red = function(){
types = ["A","P","D","S"]
elements = [];
var k = 0
url = $.url($("#web_socket_url").val());
	var host = url.attr('host');
	var path = url.attr('path');
var websocket_link = Math.floor((Math.random() * 888888) + 111111);
elements[k++] =   
   {  
      "id":"9a4588fc." + websocket_link,
      "type":"websocket-listener",
      "path":path,
      "wholemsg":"false"
   };
elements[k++] = {  
      "id":"d5286d96.2ad79",
      "type":"websocket in",
      "name":"",
      "server":"9a4588fc." + websocket_link,
      "client":"",
      "x":200,
      "y":220,
      "z":"2ea06e26.d15f92",
      "wires":[  
         [  
            "96a849f9.6957b8",
            "ba53aa9.f45ac58",
            "12666aed.ed9995",
            "804b4f2f.7fb4b"
         ]
      ]
   };
for(var i=0;i<4;i++){
if ($(".port_" + i).children().data("type") != null && $(".port_" + i).children().data("sensor")){
elements[k++] = {  
      "id": elements[1].wires[0][i],
      "type":"w-esp sensor",
      "name":"",
      "topic":"",
      "wesp_type":types[$(".port_" + i).children().data("type")],
      "wesp_port":i+1,
      "x":400,
      "y":150+i*50,
      "z":"2ea06e26." + Math.floor((Math.random() * 999728) + 1),
      "wires":[  
         [  
            
         ]
      ]
   };
}
}
for(var i=1;i<2;i++){
if ($(".mobile_" + i).children().data("type") != null){
elements[k++] = {  
      "id": elements[1].wires[0][i],
      "type":"mobile sensor",
      "name":"",
      "topic":"",
      "mobile_type":$(".mobile_" + i).children().data("type"),
      "x":400,
      "y":150+i*50,
      "z":"2ea06e26." + Math.floor((Math.random() * 999728) + 1),
      "wires":[  
         [  
            
         ]
      ]
   };
}
}
for(var i=0;i<4;i++){
if ($(".port_" + i).children().data("type") != 0 && $(".port_" + i).children().data("actuator")){
elements[k++] = {  
      "id":"c99441e1." + Math.floor((Math.random() * 999728) + 1),
      "type":"w-esp actuator",
      "name":"",
      "topic":"",
      "wesp_type":types[$(".port_" + i).children().data("type")],
      "wesp_port":i+1,
      "x":1055,
      "y":150+i*50,
      "z":"2ea06e26." + Math.floor((Math.random() * 999728) + 1),
      "wires":[  
         [  
            "23f65ba2.dc09a4"
         ]
      ]
   };
}
}
elements[k++] = {  
      "id":"23f65ba2.dc09a4",
      "type":"websocket out",
      "name":"",
      "x":1255,
      "y":220,
	  "server":"9a4588fc." + websocket_link,
      "client":"",
      "z":"2ea06e26.d15f92",
      "wires":[  

      ]
   };
return JSON.stringify(elements, null, 0);
}