import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { invoke } from '@tauri-apps/api/tauri';
import "../styles/Tasks.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCircleCheck, faMinus, faPlus, faSquarePlus, faTrash, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function Tasks({ timerStatus }) {
    const [showInput, setShowInput] = useState(false);
    const [taskContent, setTaskContent] = useState("");
    const [taskTime, setTaskTime] = useState(25);
    const [tasks, setTasks] = useState([]);
    const [time, setTime] = useState({ minutes: 0, seconds: 0 });
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        let intervalId;
        const selectedTask = tasks.find(task => task.id === selectedTaskId);

        if (timerStatus && selectedTaskId && !selectedTask.completed) {
            intervalId = setInterval(async () => {
                setTime(prevTime => {
                    let newSeconds = prevTime.seconds + 1;
                    let newMinutes = prevTime.minutes;

                    if (newSeconds === 60) {
                        newMinutes++;
                        newSeconds = 0;
                    }

                    const updatedWorkedTime = {
                        minutes: newMinutes,
                        seconds: newSeconds
                    };
                    const updatedTask = {
                        ...selectedTask,
                        worked_time: updatedWorkedTime
                    };
                    invoke("delete_task", { id: selectedTaskId });
                    invoke("set_task", { data: updatedTask });
                    return { minutes: newMinutes, seconds: newSeconds };
                });
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [timerStatus, selectedTaskId, tasks]);


    const fetchTasks = async () => {
        try {
            const response = await invoke('get_tasks');
            if (Array.isArray(response)) {
                const uniqueTasks = response.filter((task, index, self) =>
                    index === self.findIndex(t => t.id === task.id)
                ).map(task => ({ ...task, completed: false, elapsed_time: 0 }));
                setTasks(uniqueTasks);
                if (uniqueTasks.length > 0) {
                    setSelectedTaskId(uniqueTasks[0].id);
                    setTime(uniqueTasks[0].worked_time);
                }
            } else {
                console.error('Invalid response format:', response);
            }
        } catch (error) {
            console.error('Error while fetching tasks:', error);
        }
    };

    const addTask = async () => {
        if (!showInput) {
            setShowInput(true);
        }
    };

    const handleCancel = () => {
        setShowInput(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedTaskContent = taskContent.trim();
        if (trimmedTaskContent === "") {
            alert("Please enter a non-empty value for the task content.");
            return;
        }

        const newTask = {
            id: uuidv4(),
            task: taskContent,
            expected_time: parseInt(taskTime),
            worked_time: { minutes: 0, seconds: 0 },
            completed: false,
        };

        try {
            await invoke("set_task", { data: newTask });
            setTasks(prevTasks => [...prevTasks, newTask]);
            setShowInput(false);
            setTaskContent("");
            setTaskTime(25);
        } catch (error) {
            console.error('Error while sending data to backend:', error);
        }
    };


    const handleTaskContent = (e) => {
        const trimmedValue = e.target.value.trimStart();
        setTaskContent(trimmedValue);
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

    const handleTaskCompletion = async (taskId, event) => {
        const isChecked = event.target.checked;
        const currentTime = time;

        try {
            if (isChecked) {
                await invoke("delete_task", { id: taskId });
                setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            } else {
                const taskToUpdate = tasks.find(task => task.id === taskId);
                taskToUpdate.worked_time = currentTime;
                await invoke("set_task", { data: taskToUpdate });
            }
        } catch (error) {
            console.error('Error while updating task:', error);
        }

        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed, worked_time: currentTime };
            }
            return task;
        }));
    };

    const handleTaskClick = async (taskId) => {
        setSelectedTaskId(taskId);
        try {
            const response = await invoke('get_tasks');
            if (Array.isArray(response)) {
                const task = response.find(task => task.id === taskId);
                if (task) {
                    console.log(task);
                    const workedTime = task ? task.worked_time : { minutes: 0, seconds: 0 };
                    setTime(workedTime);
                } else {
                    console.log("Task with taskId not found in the response");
                }
            } else {
                console.error('Invalid response format:', response);
            }
        } catch (error) {
            console.error('Error while fetching tasks:', error);
        }

    };

    const incrementTaskTime = () => {
        setTaskTime(prevTime => parseInt(prevTime) + 1);
    };

    const decrementTaskTime = () => {
        setTaskTime(prevTime => Math.max(parseInt(prevTime) - 1, 1));
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };


    return (
        <div className="tasks-container">
            <div className="tasks-div">
                <div className="top-task">
                    <p className="task-title">Tasks</p>
                    <button className="tasks-settings" onClick={toggleSettings}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    {showSettings && (
                        <div className="task-settings">
                            <button type="button" className="tasks-clear"><FontAwesomeIcon icon={faTrashCan}/>Clear all tasks</button>
                            <button type="button" className="tasks-done-clear"><FontAwesomeIcon icon={faCircleCheck}/>Clear finished tasks</button>
                        </div>
                    )}
                </div>
                <hr className="task-hr" />
                <div>
                    {tasks && tasks.length > 0 ? (
                        <div className="task-list">
                            {tasks.map(task => (
                                <div key={task.id} className={`task-item ${selectedTaskId === task.id ? 'selected-task' : ''}`} onClick={() => handleTaskClick(task.id)}>
                                    <div className="task-content-wrapper">
                                        <div className="task-content-left">
                                            <div className="checkbox-wrapper">
                                                <div className="round">
                                                    <input
                                                        type="checkbox"
                                                        id={`task-done-${task.id}`}
                                                        className="task-done"
                                                        onChange={(event) => {
                                                            event.stopPropagation();
                                                            handleTaskCompletion(task.id, event)
                                                        }}
                                                        checked={task.completed}
                                                    />
                                                    <label htmlFor={`task-done-${task.id}`}></label>
                                                </div>
                                            </div>
                                            <p className="task-content" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                                {task.task}
                                            </p>
                                        </div>
                                        {selectedTaskId === task.id && (
                                            <div className="timers-div">
                                                <p className="time-worked">Time worked: {time.minutes.toString().padStart(2, '0')}:{time.seconds.toString().padStart(2, '0')}</p>
                                                <p className="est-time">Est. time: {task.expected_time}:00</p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <button className="delete-task" onClick={() => handleDeleteTask(task.id)}><FontAwesomeIcon icon={faTrash} /></button>
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
                                <label className="task-time-label" htmlFor="task-time">Estimated Time (min):</label>
                                <div className="time-wrapper" >
                                    <input
                                        type="number"
                                        id="task-time"
                                        onChange={handleTaskTime}
                                        value={taskTime}
                                        min="1"
                                        className="task-time"
                                    />
                                    <div className="time-buttons-div">
                                        <button type="button" className="increment-button" onClick={decrementTaskTime}>
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <button type="button" className="decrement-button" onClick={incrementTaskTime}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>

                                    </div>
                                </div>
                                <div className="new-task-bottom">
                                    <button onClick={handleCancel} className="cancel-button">
                                        Cancel
                                    </button>
                                    <button type="submit" className="add-button">Add</button>
                                </div>
                            </div>
                        </form>
                    )}
                    <button className="add-task-btn" onClick={addTask}><FontAwesomeIcon icon={faSquarePlus} /> Add Task</button>
                </div>
            </div>
        </div>
    );
}

export default Tasks;