import React, { useState } from "react";
import "../styles/Tasks.css";

function Tasks() {
    const [showInput,setShowInput] =useState(false);

    const addTask = () =>{
        if(!showInput){
            setShowInput(true);
        }
    }
    return (
        <div className="tasks-container">
            <div className="tasks-div">
                <div className="top-task">
                    <p className="task-title">Tasks</p>
                    <button className="tasks-settings">:</button>
                </div>
                <div className="add-task">
                    {showInput &&(
                        <div className="new-task">
                        <input type="radio"/>
                        <input type="text"/>
                        <button>Cancel</button>
                        <button>Add</button>
                        </div>
                    )}
                    <button className="add-task-btn" onClick={addTask}>Add Task</button>
                </div>
            </div>
        </div>
    );
    
}

export default Tasks;
