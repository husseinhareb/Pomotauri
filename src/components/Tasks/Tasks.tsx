import React, { useState, useEffect, useRef, FormEvent } from "react";
import { core } from "@tauri-apps/api";
import {
  TasksContainer,
  TasksDiv,
  TopTask,
  TaskTitle,
  TasksSettingsButton,
  TaskHr,
  TaskList,
  AddTaskButton,
  NewTask,
  TaskInput,
  TaskTimeInput,
  TimeWrapper,
  IncrementButton,
  DecrementButton,
  NewTaskBottom,
  CancelButton,
  AddButton,
  TaskItem,
  DeleteTaskButton,
  NoTasksMessage,
  TaskContentWrapper,
  TimerWrapper,
  TimeWorked,
  EstTime,
  TaskSettings,
  ClearButton,
} from "./Styles/style";

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
      const response = await core.invoke("get_tasks");
      if (Array.isArray(response)) {
        const uniqueTasks = response.filter((task, index, self) =>
          index === self.findIndex(t => t.id === task.id)
        ).map(task => ({ ...task, completed: false, worked_time: { minutes: 0, seconds: 0 } }));
        setTasks(uniqueTasks);
        if (uniqueTasks.length > 0) {
          setSelectedTaskId(uniqueTasks[0].id);
          setTime(uniqueTasks[0].worked_time);
        }
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error while fetching tasks:", error);
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
      expected_time: taskTime,
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
      console.error("Error while sending data to backend:", error);
    }
  };

  // Handle task content change
  const handleTaskContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskContent(e.target.value);
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
      console.error("Error while deleting task:", error);
    }
  };

  // Handle task completion (checkbox change)
  const handleTaskCompletion = async (taskId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      await core.invoke("delete_task", { id: taskId });
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } else {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (taskToUpdate) {
        taskToUpdate.worked_time = time;
        await core.invoke("set_task", { data: taskToUpdate });
      }
    }

    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed, worked_time: time };
      }
      return task;
    }));
  };

  // Handle task selection
  const handleTaskClick = async (taskId: number) => {
    setSelectedTaskId(taskId);
    try {
      const response = await core.invoke("get_tasks");
      if (Array.isArray(response)) {
        const task = response.find(task => task.id === taskId);
        if (task) {
          setTime(task.worked_time);
        } else {
          console.log("Task with taskId not found in the response");
        }
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error while fetching tasks:", error);
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
        !settingsRef.current.contains(event.target)
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
    setTasks(tasks.filter(task => !task.completed));
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
      console.error("Error while clearing all tasks:", error);
    }
    setShowSettings(false);
  };

  return (
    <TasksContainer>
      <TasksDiv>
        <TopTask>
          <TaskTitle>Tasks</TaskTitle>
          <TasksSettingsButton onClick={toggleSettings}>Settings</TasksSettingsButton>
          {showSettings && (
            <TaskSettings ref={settingsRef}>
              <ClearButton onClick={clearCompletedTasks}>Clear finished tasks</ClearButton>
              <ClearButton onClick={clearAllTasks}>Clear all tasks</ClearButton>
            </TaskSettings>
          )}
        </TopTask>
        <TaskHr />
        {tasks.length > 0 ? (
          <TaskList>
            {tasks.map(task => (
              <TaskItem key={task.id} selected={selectedTaskId === task.id}>
                <TaskContentWrapper>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => handleTaskCompletion(task.id, e)}
                  />
                  <span onClick={() => handleTaskClick(task.id)}>{task.task}</span>
                </TaskContentWrapper>
                {selectedTaskId === task.id && !task.completed && (
                  <TimerWrapper>
                    <TimeWorked>{`Time Worked: ${task.worked_time.minutes}:${task.worked_time.seconds.toString().padStart(2, "0")}`}</TimeWorked>
                    <EstTime>{`Estimated Time: ${task.expected_time} min`}</EstTime>
                  </TimerWrapper>
                )}
                <DeleteTaskButton onClick={() => handleDeleteTask(task.id)} />
              </TaskItem>
            ))}
          </TaskList>
        ) : (
          <NoTasksMessage>No tasks to show.</NoTasksMessage>
        )}
        {showInput ? (
          <NewTask>
            <TaskInput value={taskContent} onChange={handleTaskContent} />
            <TimeWrapper>
              <DecrementButton onClick={decrementTaskTime}>-</DecrementButton>
              <TaskTimeInput value={taskTime} onChange={handleTaskTime} />
              <IncrementButton onClick={incrementTaskTime}>+</IncrementButton>
            </TimeWrapper>
            <NewTaskBottom>
              <CancelButton onClick={handleCancel}>Cancel</CancelButton>
              <AddButton onClick={handleSubmit}>Add</AddButton>
            </NewTaskBottom>
          </NewTask>
        ) : (
          <AddTaskButton onClick={addTask}>Add Task</AddTaskButton>
        )}
      </TasksDiv>
    </TasksContainer>
  );
};

export default Tasks;
