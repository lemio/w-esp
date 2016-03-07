ws_receive = function(conn, pl) 
    --print (pl)
    if not (pl == nil) then
      local ports_to_pin = {4,3,2,1}
      print("1: " .. string.byte(pl,1))
      print("2: " .. string.byte(pl,2))
      if (string.byte(pl,1) == 138) then
        keep_alive = 0
        gpio.write(0,gpio.LOW)
        print("kept_alive")
      end
      local value =  string.sub(pl,3)
      local type = string.sub(value,1,1)
      local port = tonumber(string.sub(value,2,2))
      local payload = string.sub(value,3,-1)
      --print (type .. " servo.position(" .. port .. "," .. payload ..")")
      local num = tonumber (payload)
      if not (num == nil) then
        if (type=="P") then
            pwm.setduty(ports_to_pin[port],range(payload,1023))
        elseif (type=="S") then
            pwm.setduty(ports_to_pin[port],40+range(payload,200))
        end
      end
   end
end
range = function(val,v_max)
    return math.min(math.max(0,tonumber(val)),v_max)
end
--f.e. ws_begin("echo.websocket.org","/",80)
ws_begin = function(host,path,port)
    
    conn=net.createConnection(net.TCP, false) 
    if (tonumber(string.sub(host,-1)) == nil) then
        print("FINDING DNS")
        conn:dns(host,ws_start) 
    else
        print("IP ADRES")
        ws_start(conn, host)
    end
end
ws_start = function(conn,ip)
    conn:on("receive", ws_receive )
    print(ip)
    if conn:connect(port,ip) then
        print ("connected")
    else
        print ("not connected")
    end
    conn:send("GET "..path.." HTTP/1.1\r\n"..
    "Host:  "..host.."\r\n"..
    "Upgrade: websocket\r\n"..
    "Connection: Upgrade\r\n"..
    "Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==\r\n"..
    "Sec-WebSocket-Protocol: chat\r\n"..
    "Sec-WebSocket-Version: 13\r\n"..
    "Origin: esp".. node.chipid()..
    "\r\n\r\n")
    end
--conn:send(string.char(129,08) .. "MESSAGE1");
ws_keep_alive = function()
    conn:send(string.char(137,0));
end
ws_send = function(msg)
    --send text message over websocket
    --if  not (conn == nil) then
    conn:send(string.char(129,string.len(msg)) ..  msg);
    --end
end
ws_close = function()
    --if  not (conn == nil) then
    conn:close()
    --end
end
