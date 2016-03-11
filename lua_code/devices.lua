function deleteDevice(port, deviceType)
    local ports_to_pin = {4,3,2,1}
    if (deviceType == 0) then
    -- ANALOG DEVICE
    tmr.stop(0)
    elseif  (deviceType == 1) then
    -- ANALOG OUTPUT (LED)
    pwm.stop(ports_to_pin[port])
    elseif  (deviceType == 2) then
    -- DIGITAL INPUT
    
    elseif  (deviceType == 3) then
    -- SERVO OUTPUT
    pwm.stop(ports_to_pin[port])
    end
    ports[port] = -1
    setDevices()
end
function addDevice(port, deviceType)
    deleteDevice(port,deviceType)
    local ports_to_pin = {4,3,2,1}
    ports[port] = deviceType
    if (deviceType == 0) then
    -- ANALOG DEVICE
    tmr.alarm(0, 1000, 1, function() 
    value = adc.read(0)
    ws_send("A1" .. value)
    end )
    elseif  (deviceType == 1) then
    -- ANALOG OUTPUT (LED)
    pwm.setup(ports_to_pin[port],100,1000)
    pwm.start(ports_to_pin[port])
    elseif  (deviceType == 2) then
    -- DIGITAL INPUT
    gpio.mode(ports_to_pin[port],gpio.INT, gpio.PULLUP)
    gpio.trig(ports_to_pin[port], "both", function(level) if (level == 0) then
                                            ws_send("D" .. port .. "1")
                                            else
                                            ws_send("D" .. port .. "0")
                                            end
                                            end)
    --gpio.trig(ports_to_pin[port], "up"  , ws_send("D" .. port .. "1"))
    elseif  (deviceType == 3) then
    -- SERVO OUTPUT
    pwm.setup(ports_to_pin[port],100,40)
    pwm.start(ports_to_pin[port])
    end
    setDevices()
    print("DEVICE (".. port .. " " .. deviceType);
end
function getDevices()
    dofile("devices_conf.lua")
    print("DEVICES&1&" .. ports[1] .. "&2&" .. ports[2] .. "&3&" .. ports[3] .. "&4&" .. ports[4] .. "&")
end
function setDevices()
    
    file.open("devices_conf.lua","w+");
    local w = file.writeline
    w("ports = {"..ports[1] ..","..ports[2] ..",".. ports[3] ..",".. ports[4] .."}");
    file.close();
end
------------------------------
