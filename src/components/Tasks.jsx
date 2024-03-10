import React, { useState, useEffect } from "react";
import "../styles/Tasks.css";
import barsIco from "../assets/icons/barsIco.svg";
import { invoke } from '@tauri-apps/api/tauri';

function Tasks() {
    const [showInput, setShowInput] = useState(false);
    const [taskContent, setTaskContent] = useState("");
    const [taskTime, setTaskTime] = useState(25);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await invoke('get_tasks');
            if (Array.isArray(response)) {
                const uniqueTasks = response.filter((task, index, self) =>
                    index === self.findIndex(t => t.id === task.id)
                );
                setTasks(uniqueTasks);
            } else {
                console.error('Invalid response format:', response);
            }
        } catch (error) {
            console.error('Error while fetching tasks:', error);
        }
    };


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
        const newTask = { id: tasks.length + 1, task: taskContent, expected_time: taskTime };

        try {
            await invoke("set_task", { data: newTask });
            console.log(newTask);
            setTasks(prevTasks => [...prevTasks, newTask])
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

    const handleDeleteTask = async (taskId) => {
        try {
            await invoke("delete_task", { id: taskId });
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Error while deleting task:', error);
        }
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
                <div className="task-list">
                    {tasks && tasks.length > 0 ? (
                        <div className="task-list">
                            {tasks.map(task => (
                                <div key={task.id} className="task-item">
                                    <div>
                                        <input type="checkbox" />
                                    </div>
                                    <p>{task.task}</p>
                                    <p>{task.expected_time}</p>
                                    <div>
                                        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    ) : (
                        <p>No tasks available</p>
                    )}

                </div>
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
