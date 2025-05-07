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

      intervalId = setInterval(async () => {
        setTime(prev => {
          let secs = prev.seconds + 1;
          let mins = prev.minutes;
          if (secs === 60) { secs = 0; mins += 1; }
          if (mins === 60) { secs = 0; mins = 0; }
          const updated = { minutes: mins, seconds: secs };
          const updatedTask = { ...selected, worked_time: updated };
          core.invoke("set_task", { data: updatedTask });
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
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed, worked_time: time } : t));
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
          <TasksSettingsButton onClick={toggleSettings}>Settings</TasksSettingsButton>
          {showSettings && (
            <TaskSettings ref={settingsRef}>
              <ClearButton onClick={clearFinished}>Clear finished</ClearButton>
              <ClearButton onClick={clearAll}>Clear all</ClearButton>
            </TaskSettings>
          )}
        </TopTask>
        <TaskHr />
        {tasks.length ? (
          <TaskList>
            {tasks.map(t => (
              <TaskItem key={t.id} selected={t.id === selectedTaskId}>
                <TaskContentWrapper>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={e => handleCompletion(t.id, e.target.checked)}
                  />
                  <span onClick={() => handleClick(t.id)}>{t.task}</span>
                </TaskContentWrapper>
                {t.id === selectedTaskId && !t.completed && (
                  <TimerWrapper>
                    <TimeWorked>{`Worked: ${t.worked_time.minutes}:${t.worked_time.seconds.toString().padStart(2, '0')}`}</TimeWorked>
                    <EstTime>{`Est: ${t.expected_time}m`}</EstTime>
                  </TimerWrapper>
                )}
                <DeleteTaskButton onClick={() => handleDelete(t.id)} />
              </TaskItem>
            ))}
          </TaskList>
        ) : (
          <NoTasksMessage>No tasks.</NoTasksMessage>
        )}
        {showInput ? (
          <NewTask>
            <TaskInput value={taskContent} onChange={e => setTaskContent(e.target.value)} />
            <TimeWrapper>
              <DecrementButton onClick={decTime}>-</DecrementButton>
              <TaskTimeInput value={taskTime} onChange={e => setTaskTime(Number(e.target.value))} />
              <IncrementButton onClick={incTime}>+</IncrementButton>
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
}

export default Tasks;
