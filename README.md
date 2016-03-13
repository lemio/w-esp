# w-esp
![W-esp enable students to play with the internet of things](https://raw.githubusercontent.com/lemio/w-esp/master/concept.png)

 The W-esp is a toolkit that enables the first and second year students of secondary education to connect sensors and actuators to the internet and create interactive systems that use the internet of things. This could be for example a locker that is controlled by your mobile phone, a system that prevent your grandmother from sleepwalking, automatically feeds the chickens… the sky is the limit.

The process of building such a system consists of three steps. First the w-esp needs to know which sensors and actuators are connected to the board, by using a drag and drop system [see step 1] the user can drop the in- and output icons on the different ports. After doing that the hardware needs to be physically connected to the w-esp [step 2]. Now the students can open a flow chart programming system based on Node-red(IBM) [step 3] in which they can flows consisting of input blocks, output blocks and processing blocks.

I learned very early the difference between knowing the name of something and knowing something. – R.P. Feynman

In this way the children can learn about programming concepts, without the need to learn difficult syntaxes and languages, they also can use the internet (social media, mobile phone) as in or output and in this way create awesome projects.

#Getting started (software)


* Update the firmware on your w-esp (see the folder final_firmware_esp)
* Put the LUA code on your esp board (see the folder lua_code)
* Donwload node.js https://nodejs.org/en/
* Run node-red (see folder w-esp-node-red)
* Open the chrome app (see folder w-esp-chrome-app)
* Find your IP adress (start; type cmd and press enter) -> type ipconfig in the command line
* Fill in the connection details in the chrome app
* Connect the blocks you want to use
* Hit launch node-red
* Click on the right-top
* Click import from clipboard
* Start playing with node-red

# Getting started hardware

* Getting the parts (see folder hardware)
* Solder or make a breadboard setup for your components
* 3D print a casing (optional)
* print a sticker for the port mapping (optional)

# Future

* Live debugging (in a visual way), the threshold to use the debug function is still to high. Ideally you want to see the messages, and their values flowing through the wires. Also the icons of the sensors/actuators could show their status (in a way that you can really see the servo moving, and the pushbutton being pushed in the software)
* Larger icons and corresponding color in node-red, also connecting the visual styles of node-red and w-esp more. The w-esp software and the node-red software are still two different things, they should merge to one system node-red should also communicate what is connected to the w-esp hardware.
* More decent firmware (native c++), the current firmware is based on LUA, because it was easier to write it in LUA. But when moving to production the firmware should be based on c/c++ because then the hardware could be used optimal and memory issues are history.
* Integration with other (flow chart/data logging) online services, for example If this than that (a cloud service for connecting different application programming interfaces with each other and Thingspeak (data logging service).
* More solid (and less open) course material, based on the feedback from Frank, teachers want to have something to fall back at. Perhaps this could be in combination with inspiration on different design briefs for the teacher.
* Focus more on how girls relate to this subject, using textiles/more context/less hands-on.
* Try to use the hardware that is already in the school (most physics classes have banana connectors and hardware that can be connected with those banana wires.
* More hardware to connect to the w-esp (and perhaps an advanced toolkit) for example klikaanklikuit remote controlled relays, distance sensors, speakers, light sensor, temperature sensor, touch sensor.
* Running a pilot with different schools to detect practical problems.
