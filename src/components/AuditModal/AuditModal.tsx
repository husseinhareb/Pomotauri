// src/components/AuditModal/AuditModal.tsx
import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { core } from "@tauri-apps/api"; // ← same as Tasks.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ModalOverlay, ModalContent, CloseBtn } from "./Styles/style";

interface TimerDuration {
  minutes: number;
  seconds: number;
}

type RawAuditEntry = [string, TimerDuration, number];

interface DailyStat {
  date: string;
  minutes: number;
}

interface TaskStat {
  name: string;
  minutes: number;
}

interface AuditModalProps {
  onClose: () => void;
}

const AuditModal: React.FC<AuditModalProps> = ({ onClose }) => {
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [byTask, setByTask] = useState<TaskStat[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 1. Handle Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // 2. Fetch audit via core.invoke
  useEffect(() => {
    (async () => {
      try {
        const now = Math.floor(Date.now() / 1000);
        const weekAgo = now - 7 * 86400;

        const raw = await core.invoke<RawAuditEntry[]>(
          "get_audit_for_period",
          { since_epoch: weekAgo, until_epoch: now }
        );

        const dailyMap: Record<string, number> = {};
        const taskMap: Record<string, number> = {};

        raw.forEach(([task_id, dur, ts]) => {
          const date = new Date(ts * 1000).toLocaleDateString();
          const mins = dur.minutes + dur.seconds / 60;
          dailyMap[date] = (dailyMap[date] || 0) + mins;
          taskMap[task_id] = (taskMap[task_id] || 0) + mins;
        });

        setDailyStats(
          Object.entries(dailyMap).map(([date, minutes]) => ({ date, minutes }))
        );
        setByTask(
          Object.entries(taskMap).map(([name, minutes]) => ({ name, minutes }))
        );
      } catch (e: any) {
        console.error("Failed to fetch audit:", e);
        setError(e.message || "Unknown error");
      }
    })();
  }, []);

  // 3. Only close when clicking backdrop (not modal content)
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return createPortal(
    <ModalOverlay onClick={handleBackdropClick}>
      <ModalContent>
        <CloseBtn onClick={onClose} aria-label="Close audit modal">
          ×
        </CloseBtn>

        {error ? (
          <p style={{ color: "red" }}>Error loading data: {error}</p>
        ) : (
          <>
            <h2>Weekly Time Worked</h2>
            <BarChart width={450} height={250} data={dailyStats}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" fill="#c15c5c" />
            </BarChart>

            <h2>Time by Task</h2>
            <PieChart width={450} height={300}>
              <Pie
                data={byTask}
                dataKey="minutes"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {byTask.map((_, i) => (
                  <Cell
                    key={i}
                    fill={["#8884d8", "#82ca9d", "#ffc658"][i % 3]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </>
        )}
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};

export default AuditModal;
