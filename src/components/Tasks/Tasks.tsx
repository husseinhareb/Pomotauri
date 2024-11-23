import React, { useState, useEffect, useRef, FormEvent } from "react";
import { core } from '@tauri-apps/api/';

interface Task {
  id: number;
  task: string;
  expected_time: number;
  worked_time: {
    minutes: number;
    seconds: number;
  };
  completed: boolean;
}

interface TasksProps {
  timerStatus: boolean;
}

const Tasks: React.FC<TasksProps> = ({ timerStatus }) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [taskContent, setTaskContent] = useState<string>("");
  const [taskTime, setTaskTime] = useState<number>(25);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [time, setTime] = useState<{ minutes: number; seconds: number }>({ minutes: 0, seconds: 0 });
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Timer logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (timerStatus && selectedTaskId) {
      const selectedTask = tasks.find(task => task.id === selectedTaskId);

      if (selectedTask && !selectedTask.completed) {
        intervalId = setInterval(async () => {
          setTime(prevTime => {
            let newSeconds = prevTime.seconds + 1;
            let newMinutes = prevTime.minutes;

            if (newSeconds === 60) {
              newSeconds = 0;
              newMinutes++;
            }

            if (newMinutes === 60) {
              newMinutes = 0;
              setTime({ minutes: 0, seconds: 0 }); // Reset time after 60 minutes
            }

            const updatedWorkedTime = {
              minutes: newMinutes,
              seconds: newSeconds
            };
            const updatedTask = {
              ...selectedTask,
              worked_time: updatedWorkedTime
            };
            core.invoke("delete_task", { id: selectedTaskId });
            core.invoke("set_task", { data: updatedTask });
            return { minutes: newMinutes, seconds: newSeconds };
          });
        }, 1000);
      }
    }

    return () => clearInterval(intervalId);
  }, [timerStatus, selectedTaskId, tasks]);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await core.invoke('get_tasks');
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

  // Add new task (display input)
  const addTask = () => {
    setShowInput(true);
  };

  // Cancel adding new task
  const handleCancel = () => {
    setShowInput(false);
  };

  // Handle task submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedTaskContent = taskContent.trim();
    if (trimmedTaskContent === "") {
      alert("Please enter a non-empty value for the task content.");
      return;
    }

    const newTask: Task = {
      id: Date.now(),  // Using timestamp as task ID
      task: taskContent,
      expected_time: parseInt(taskTime.toString(), 10),
      worked_time: { minutes: 0, seconds: 0 },
      completed: false,
    };

    try {
      await core.invoke("set_task", { data: newTask });
      setTasks(prevTasks => [...prevTasks, newTask]);
      setShowInput(false);
      setTaskContent("");
      setTaskTime(25);  // Reset to default time
    } catch (error) {
      console.error('Error while sending data to backend:', error);
    }
  };

  // Handle task content change
  const handleTaskContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trimStart();
    setTaskContent(trimmedValue);
  };

  // Handle task time change
  const handleTaskTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTime(Number(e.target.value));
  };

  // Delete task
  const handleDeleteTask = async (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    try {
      await core.invoke("delete_task", { id: taskId });
    } catch (error) {
      console.error('Error while deleting task:', error);
    }
  };

  // Handle task completion (checkbox change)
  const handleTaskCompletion = async (taskId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target?.checked;  // Safe check for 'checked'
    const currentTime = time;

    if (isChecked === undefined) return;

    try {
      if (isChecked) {
        await core.invoke("delete_task", { id: taskId });
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      } else {
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
          taskToUpdate.worked_time = currentTime;
          await core.invoke("set_task", { data: taskToUpdate });
        }
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

  // Handle task selection
  const handleTaskClick = async (taskId: number) => {
    setSelectedTaskId(taskId);
    try {
      const response = await core.invoke('get_tasks');
      if (Array.isArray(response)) {
        const task = response.find(task => task.id === taskId);
        if (task) {
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

  // Increment task time
  const incrementTaskTime = () => {
    setTaskTime(prevTime => prevTime + 1);
  };

  // Decrement task time
  const decrementTaskTime = () => {
    setTaskTime(prevTime => Math.max(prevTime - 1, 1));
  };

  // Toggle settings visibility
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        event.target instanceof HTMLElement &&
        !(settingsRef.current.contains(event.target)) &&
        !(event.target.closest('.tasks-settings') instanceof HTMLElement)
      ) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear completed tasks
  const clearCompletedTasks = () => {
    const updatedTasks = tasks.filter(task => !task.completed);
    setTasks(updatedTasks);
    setShowSettings(false);
  };

  // Clear all tasks
  const clearAllTasks = async () => {
    setTasks([]);

    try {
      for (const task of tasks) {
        await core.invoke("delete_task", { id: task.id });
      }
      setSelectedTaskId(null);
      setTime({ minutes: 0, seconds: 0 });
    } catch (error) {
      console.error('Error while clearing all tasks:', error);
    }
    setShowSettings(false);
  };

  return (
    <div className="tasks-container">
      <div className="tasks-div">
        <div className="top-task">
          <p className="task-title">Tasks</p>
          <button className="tasks-settings" onClick={toggleSettings}>
            Settings
          </button>
          {showSettings && (
            <div ref={settingsRef} className="task-settings">
              <button type="button" className="tasks-done-clear" onClick={clearCompletedTasks}>Clear finished tasks</button>
              <button type="button" className="tasks-clear" onClick={clearAllTasks}>Clear all tasks</button>
            </div>
          )}
        </div>
        <hr className="task-hr" />
        <div>
          {tasks.length > 0 ? (
            <div className="task-list">
              {tasks.map(task => (
                <div key={task.id} className={`task-item ${selectedTaskId === task.id ? 'selected-task' : ''}`} onClick={() => handleTaskClick(task.id)}>
                  <div className="task-content-wrapper">
                    <div className="task-content-left">
                      <div className="checkbox-wrapper">
                        <input
                          type="checkbox"
                          id={`task-done-${task.id}`}
                          className="task-done"
                          onChange={(event) => {
                            event.stopPropagation();
                            handleTaskCompletion(task.id, event);
                          }}
                          checked={task.completed}
                        />
                        <label htmlFor={`task-done-${task.id}`}></label>
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
                    <button className="delete-task" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-tasks-sentence">No tasks available.</p>
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
                <div className="time-wrapper">
                  <input
                    type="number"
                    id="task-time"
                    onChange={handleTaskTime}
                    value={taskTime}
                    min="1"
                    max="59"
                    className="task-time"
                  />
                  <div className="time-buttons-div">
                    <button type="button" className="increment-button" onClick={decrementTaskTime}>-</button>
                    <button type="button" className="decrement-button" onClick={incrementTaskTime}>+</button>
                  </div>
                </div>
                <div className="new-task-bottom">
                  <button onClick={handleCancel} className="cancel-button">Cancel</button>
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
};

export default Tasks;
