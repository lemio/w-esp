#Lua code

First update the firmware on the ESP chip (see the firmware section), this is needed to make sure there is enough heap space for the program to run.

Open the files in ESPlorer or another LUA editor
https://github.com/4refr0nt/ESPlorer

upload them to the ESP chip

compile them

delete the not compiled versions

The tree is as follows

init.lua
(Initializes the program, also makes sure that you can stop the other code from running by connecting pin 4 to the ground)
	 "start"
	 (requires all the other files, is the main program, it deals with the WIFI, makes all devices are added and keeps the websocket alive, or restarts the connection)
		 "start_stop_functions"
		(Takes care of the devices that are plugged or unplugged in the software, makes sure (PWM) ports are configured in the right way, and sets the triggers for the inputs)
		 "ssid"
		 (Where the WIFI password is stored, don't compile this one!)
		 "connection"
		 (Where the connection domain, path and port are, don't compile this one!)
		 "web"
		 (All the functions for making the websocket protocol)
		 "w-esp"
		 (All the functions for changing settings from the chrome app, connection and wifi)

