require "start_stop_functions"
require "ssid"
require "connection"
require "web"
require "w-esp"
keep_alive = 0
tmr.alarm(6, 200, 1, function ()
    if (wifi.sta.status() == 5) then
    gpio.write(0,gpio.HIGH)
        print("WESP_WIFI_CONNECTED")
        tmr.alarm(6, 100, 0, function ()
            startConnection()
            dofile("devices.lua")
            addDevice(1,ports[1],true)
            addDevice(2,ports[2],true)
            addDevice(3,ports[3],true)
            addDevice(4,ports[4],true)
            tmr.alarm(6,2000,1, function ()
            gpio.write(0,gpio.HIGH)
                if (keep_alive > 2) then
                    keep_alive = 0
                    ws_close()
                    ws_begin(host,path,port)
                    --reconnect
                end
                keep_alive = keep_alive + 1
                ws_keep_alive()
            end
            )
        end
        )
    end
end
)



