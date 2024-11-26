import React, { useState, useEffect } from "react";

const Clock: React.FC = () => {
    const getTime = (): Date => new Date();

    const [time, setTime] = useState<Date>(getTime());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(getTime());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const formattedTime: string = time.toLocaleTimeString();

    return (
        <div className="clock">
            {formattedTime}
        </div>
    );
};

export default Clock;
