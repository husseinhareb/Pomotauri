import React, { useState } from "react";
import "../styles/Tasks.css";
import barsIco from "../assets/icons/barsIco.svg";
function Tasks() {
    const [showInput, setShowInput] = useState(false);

    const addTask = () => {
        if (!showInput) {
            setShowInput(true);
        }
    }
    const handleCancel = () => {
        setShowInput(false)
    }

    return (
        <div className="tasks-container">
            <div className="tasks-div">
                <div className="top-task">
                    <p className="task-title">Tasks</p>
                    <button className="tasks-settings">
                       S <img src={barsIco} alt="Icon" />
                    </button>
                </div>
                <hr></hr>
                <div className="add-task">
                    {showInput && (
                        <div className="new-task">
                            <input type="text"
                                placeholder="Enter your task" 
                                className="task-input"/>
                            <div className="new-task-bottom">
                            <button onClick={handleCancel}>Cancel</button>
                            <button>Add</button>
                            </div>
                        </div>
                    )}
                    <button className="add-task-btn" onClick={addTask}>Add Task</button>
                </div>
            </div>
        </div>
    );

}

export default Tasks;
