import React, { useState, useEffect } from "react";

function Clock() {
    const getTime = () => new Date();

    const [time, setTime] = useState(getTime());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(getTime());
        }, 1000);

        return () => clearInterval(intervalId); 
    }, []); 

    const formattedTime = time.toLocaleTimeString();

    return (
        <div className="clock">
            {formattedTime}
        </div>
    )
}

export default Clock;
