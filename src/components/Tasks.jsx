import React, { useState } from "react";
import "../styles/Tasks.css";
import barsIco from "../assets/icons/barsIco.svg";
import { invoke } from '@tauri-apps/api/tauri';

function Tasks() {
    const [showInput, setShowInput] = useState(false);
    const [taskContent, setTaskContent] = useState("");
    const [taskTime, setTaskTime] = useState(25);
    const [tasks, setTasks] = useState([]); 

    const addTask = () => {
        if (!showInput) {
            setShowInput(true);
        }
    };

    const handleCancel = () => {
        setShowInput(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTask = { id: tasks.length + 1, task: taskContent, expectedTime: taskTime };
    
        try {
            await invoke("set_task", { data: newTask });
            console.log(newTask);
            setTasks([...tasks, newTask]);
            setShowInput(false);
            setTaskContent("");
            setTaskTime(25);
        } catch (error) {
            console.error('Error while sending data to backend:', error);
        }
    };
    

    const handleTaskContent = (e) => {
        setTaskContent(e.target.value);
    };

    const handleTaskTime = (e) => {
        setTaskTime(e.target.value);
    };

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
                        <form onSubmit={handleSubmit}>
                            <div className="new-task">
                                <input
                                    type="text"
                                    onChange={handleTaskContent}
                                    value={taskContent} 
                                    placeholder="Enter your task"
                                    className="task-input"
                                />
                                <input
                                    type="number"
                                    onChange={handleTaskTime}
                                    value={taskTime} 
                                    className="task-time"
                                />
                                <div className="new-task-bottom">
                                    <button onClick={handleCancel} className="cancel-button">
                                        Cancel
                                    </button>
                                    <button type="submit" className="add-button">Add</button>
                                </div>
                            </div>
                        </form>
                    )}
                    <button className="add-task-btn" onClick={addTask}>Add Task</button>
                </div>
            </div>
        </div>
    );
}

export default Tasks;
