function changeWifi (ssid,password)
    --Change the wifi SSID and password settings
    file.remove("ssid.lua");
    file.open("ssid.lua","w+");
    w = file.writeline;
    w("ssid=\""..ssid.."\"");
    w("password=\""..password.."\"");
    file.close();
    end
function readWifi()
    dofile("ssid.lua")
    print("SSID&"..ssid.."&PASS&"..password);
end
function connectWifi()
    wifi.setmode(wifi.STATION)
    dofile("ssid.lua")
    wifi.sta.config(ssid,password)
    wifi.sta.connect()
end
function changeConnection(host,path,port)
    file.remove("connection.lua");
    file.open("connection.lua","w+");
    w = file.writeline;
    w("host=\""..host.."\"");
    w("path=\""..path.."\"");
    w("port="..port.."");
    file.close();

end
function readConnection()
    dofile("connection.lua")
    print("HOST&"..host.."&PATH&"..path .."&PORT&"..port);

end
function startConnection()
    --ws_close()
    dofile("connection.lua")
    ws_begin(host,path,port)
end
function closeConnection()

end
