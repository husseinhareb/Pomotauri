// Tasks.tsx
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
  id: string;
  task: string;
  expected_time: number;
  worked_time: { minutes: number; seconds: number };
  completed: boolean;
}

interface TasksProps {
  timerStatus: boolean;
}

const Tasks: React.FC<TasksProps> = ({ timerStatus }) => {
  const [showInput, setShowInput] = useState(false);
  const [taskContent, setTaskContent] = useState("");
  const [taskTime, setTaskTime] = useState(25);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Timer effect: update worked_time in DB
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const updateLoop = async () => {
      if (!timerStatus || !selectedTaskId) return;
      const selected = tasks.find(t => t.id === selectedTaskId);
      if (!selected || selected.completed) return;

      intervalId = setInterval(() => {
        setTime(prev => {
          let secs = prev.seconds + 1;
          let mins = prev.minutes;
          if (secs === 60) { secs = 0; mins += 1; }
          if (mins === 60) { secs = 0; mins = 0; }
          const updated = { minutes: mins, seconds: secs };
          core.invoke("set_task", { data: { ...selected, worked_time: updated } });
          return updated;
        });
      }, 1000);
    };
    updateLoop();
    return () => clearInterval(intervalId);
  }, [timerStatus, selectedTaskId, tasks]);

  const fetchTasks = async () => {
    try {
      const response = await core.invoke<Task[]>("get_tasks");
      if (Array.isArray(response)) {
        const unique = response.map(t => ({ ...t, completed: false }));
        setTasks(unique);
        if (unique.length) {
          setSelectedTaskId(unique[0].id);
          setTime(unique[0].worked_time);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addTask = () => setShowInput(true);
  const handleCancel = () => setShowInput(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!taskContent.trim()) {
      return alert("Enter a task.");
    }
    const newTask: Task = {
      id: Date.now().toString(),
      task: taskContent,
      expected_time: taskTime,
      worked_time: { minutes: 0, seconds: 0 },
      completed: false,
    };
    await core.invoke("set_task", { data: newTask });
    setTasks(prev => [...prev, newTask]);
    setShowInput(false);
    setTaskContent("");
    setTaskTime(25);
  };

  const handleDelete = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await core.invoke("delete_task", { id });
  };

  const handleCompletion = async (id: string, checked: boolean) => {
    if (checked) {
      handleDelete(id);
    } else {
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.worked_time = time;
        await core.invoke("set_task", { data: task });
      }
    }
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed, worked_time: time } : t
    ));
  };

  const handleClick = async (id: string) => {
    setSelectedTaskId(id);
    const all = await core.invoke<Task[]>("get_tasks");
    const found = Array.isArray(all) && all.find(t => t.id === id);
    if (found) setTime(found.worked_time);
  };

  const incTime = () => setTaskTime(t => t + 1);
  const decTime = () => setTaskTime(t => Math.max(1, t - 1));
  const toggleSettings = () => setShowSettings(s => !s);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const clearFinished = () => { setTasks(ts => ts.filter(t => !t.completed)); setShowSettings(false); };
  const clearAll = async () => {
    for (const t of tasks) await core.invoke("delete_task", { id: t.id });
    setTasks([]); setSelectedTaskId(null); setTime({ minutes: 0, seconds: 0 }); setShowSettings(false);
  };

  return (
    <TasksContainer>
      <TasksDiv>
        <TopTask>
          <TaskTitle>Tasks</TaskTitle>
          <TasksSettingsButton onClick={toggleSettings}>&#x22EE;</TasksSettingsButton>
          {showSettings && (
            <TaskSettings ref={settingsRef}>
              <ClearButton onClick={clearFinished}>&#x2713; Clear finished tasks</ClearButton>
              <ClearButton onClick={clearAll}>&#x1F5D1; Clear all tasks</ClearButton>
            </TaskSettings>
          )}
        </TopTask>

        <TaskHr />

        {tasks.length ? (
          <TaskList>
            {tasks.map(t => (
              <TaskItem key={t.id} selected={t.id === selectedTaskId} onClick={() => handleClick(t.id)}>
                <TaskContentWrapper>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={e => { e.stopPropagation(); handleCompletion(t.id, e.target.checked); }}
                  />
                  <span style={{ textDecoration: t.completed ? "line-through" : "none" }}>
                    {t.task}
                  </span>
                </TaskContentWrapper>

                {t.id === selectedTaskId && (
                  <TimerWrapper>
                    <TimeWorked>
                      Time worked: {time.minutes.toString().padStart(2, "0")}:
                      {time.seconds.toString().padStart(2, "0")}
                    </TimeWorked>
                    <EstTime>Est. time: {t.expected_time}:00</EstTime>
                  </TimerWrapper>
                )}

                <DeleteTaskButton onClick={e => { e.stopPropagation(); handleDelete(t.id); }}>&#x1F5D1;</DeleteTaskButton>
              </TaskItem>
            ))}
          </TaskList>
        ) : (
          <NoTasksMessage>No tasks available.</NoTasksMessage>
        )}

        {showInput ? (
          <NewTask as="form" onSubmit={handleSubmit}>
            <TaskInput
              type="text"
              placeholder="Enter your task"
              value={taskContent}
              onChange={e => setTaskContent(e.target.value)}
            />
            <TimeWrapper>
              <TaskTimeInput
                type="number"
                min={1}
                max={59}
                value={taskTime}
                onChange={e => setTaskTime(Number(e.target.value))}
              />
              <IncrementButton type="button" onClick={decTime}>&#x2212;</IncrementButton>
              <DecrementButton type="button" onClick={incTime}>&#x2b;</DecrementButton>
            </TimeWrapper>
            <NewTaskBottom>
              <CancelButton type="button" onClick={handleCancel}>Cancel</CancelButton>
              <AddButton type="submit">Add</AddButton>
            </NewTaskBottom>
          </NewTask>
        ) : (
          <AddTaskButton type="button" onClick={addTask}>+ Add Task</AddTaskButton>
        )}
      </TasksDiv>
    </TasksContainer>
  );
};

export default Tasks;
