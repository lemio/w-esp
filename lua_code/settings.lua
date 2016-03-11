function changeWifi (ssid,password)
    --Change the wifi SSID and password settings
    file.remove("wifi_conf.lua");
    file.open("wifi_conf.lua","w+");
    w = file.writeline;
    w("ssid=\""..ssid.."\"");
    w("password=\""..password.."\"");
    file.close();
    end
function readWifi()
    dofile("wifi_conf.lua")
    print("SSID&"..ssid.."&PASS&"..password);
end
function connectWifi()
    wifi.setmode(wifi.STATION)
    dofile("wifi_conf.lua")
    wifi.sta.config(ssid,password)
    wifi.sta.connect()
end
function changeConnection(host,path,port)
    file.remove("connection_conf.lua");
    file.open("connection_conf.lua","w+");
    w = file.writeline;
    w("host=\""..host.."\"");
    w("path=\""..path.."\"");
    w("port="..port.."");
    file.close();

end
function readConnection()
    dofile("connection_conf.lua")
    print("HOST&"..host.."&PATH&"..path .."&PORT&"..port);

end
function startConnection()
    --ws_close()
    dofile("connection_conf.lua")
    ws_begin(host,path,port)
end
function closeConnection()

end
