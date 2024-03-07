import React, { useState, useRef, useEffect } from "react";
import "../styles/Tasks.css";

function Tasks() {
    const [taskList, setTaskList] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const inputRef = useRef(null);

    const addTask = () => {
        if (!showInput) {
            setShowInput(true);
        }
    };

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setShowInput(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleTaskChange = (text) => {
        setTaskList([{ id: Date.now(), text }]);
        setShowInput(false);
    };

    return (
        <div className="tasks-container">
            <div className="tasks-div">
                <div className="top-task">
                    <p className="task-title">Tasks</p>
                    <button className="tasks-settings">:</button>
                </div>
                {showInput && (
                    <div className="added-task" ref={inputRef}>
                        <input
                            type="text"
                            onChange={(e) => handleTaskChange(e.target.value)}
                            placeholder="Enter task"
                        />
                    </div>
                )}
                {!showInput && (
                    <div className="add-task">
                        <button className="add-task-btn" onClick={addTask}>Add Task</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tasks;
