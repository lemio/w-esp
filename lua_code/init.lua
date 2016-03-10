tmr.alarm(6, 3000, 0, function ()
gpio.mode(4,gpio.INPUT, gpio.PULLUP)
if (gpio.read(4)==1) then
   dofile("start.lc") 
else 
print("NO KICKSTART")
end
end
)
