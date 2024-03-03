import React, { useState } from "react";

function Clock() {
    const getTime = () => new Date();

    const [time, setTime] = useState(getTime());

    const update = () => {
        setTime(getTime());
    }
    setInterval(update, 1000);
    const formattedTime = time.toLocaleTimeString();

    return (
        <div className="clock">
            {formattedTime}
        </div>
    )
}

export default Clock;