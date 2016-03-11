#Lua code

First update the firmware on the ESP chip (see the firmware section), this is needed to make sure there is enough heap space for the program to run.

Open the files in ESPlorer or another LUA editor
https://github.com/4refr0nt/ESPlorer

1. Upload the files to the ESP chip
2. Compile those files (except the conf.lua files)
3. Delete the not compiled versions from the chip (except the conf.lua files)


## Overview of files
### init
(Initializes the program, also makes sure that you can stop the other code from running by connecting pin 4 to the ground)

### start
"start" (requires all the other files, is the main program, it deals with the WIFI, makes all devices are added and keeps the websocket alive, or restarts the connection)

### devices
(Takes care of the devices that are plugged or unplugged in the software, makes sure (PWM) ports are configured in the right way, and sets the triggers for the inputs)

| Type            | DeviceType |
| --------------- | ----------:|
| NO_CONNECTION   |          -1|
| ANALOG_DEVICE   |           0|
| ANALOG_OUTPUT   |           1|
| DIGITAL_INPUT   |           2|
| SERVO_OUTPUT    |           3|


**deleteDevice** (port (port on the w-esp 1-4; integer), deviceType (type of device 0-3; integer)

Deletes the device, disable the pwm/trigger/analog behavior

**addDevice** (port (port on the w-esp 1-4; integer), deviceType (type of device 0-3; integer)

Adds the device, enables the pwm/trigger/analog behavior 

**getDevices** ()

Prints the current devices connected to the w-esp in this format:
`DEVICES&1&(P1)&2&(P2)&3&(P3)&4&(P4)&`
where (Px) is replaced with the deviceType

**setDevices** ()

Save the current global ports variable in the devices.conf.lua file

### websocket

**ws_recieve** (conn (.net connection), payload (string))

Handle the recieved messages

**range** (val; integer, max; integer) 

Fit a value within a range from (0 to max)

**ws_begin** (host (domain name or IP string), path (string),port (string))

Start a .net connection with the host

**ws_start** (conn (.net connection), IP (String))

Setup a websocket connection with the conn

**ws_keep_alive** () 

Send ping (keep alive) message; it should give back a pong message (still alive)

**ws_send** (msg) 

Send a websocket message, with a specific content

**ws_close** () 

Close the websocket client

### settings

(All the functions for changing settings from the chrome app, connection and wifi)



* "ssid" (Where the WIFI password is stored, don't compile this one!)
* "connection" (Where the connection domain, path and port are, don't compile this one!)
* "w-esp" 

