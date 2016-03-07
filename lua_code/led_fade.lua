i = 0
pwm.setup(2,600,0)
tmr.alarm(0, 10, 1, function ()
        if (i<1024) then
        pwm.setduty(2,i)
        i = i + 1
        else
        i = 0
        end
    end 
    )
