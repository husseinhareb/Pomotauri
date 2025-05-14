#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

#[derive(Debug, Deserialize, Serialize)]
pub struct TimerDuration { pub minutes: u32, pub seconds: u32 }

#[derive(Debug, Deserialize, Serialize)]
pub struct TimerSettings { pub pomodoro_time: TimerDuration, pub short_break_time: TimerDuration, pub long_break_time: TimerDuration }

#[derive(Debug, Deserialize, Serialize)]
pub struct Task { pub id: String, pub task: String, pub expected_time: u32, pub worked_time: TimerDuration }

fn initialize_database(app_handle: &AppHandle) -> Result<Connection, String> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
    let db_path = app_dir.join("data.db");
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute_batch(
        r#"
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY,
          pomodoro_minutes INTEGER,
          pomodoro_seconds INTEGER,
          short_break_minutes INTEGER,
          short_break_seconds INTEGER,
          long_break_minutes INTEGER,
          long_break_seconds INTEGER
        );
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          task TEXT NOT NULL,
          expected_time INTEGER NOT NULL,
          worked_minutes INTEGER NOT NULL,
          worked_seconds INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS audit (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          task_id TEXT NOT NULL,
          worked_minutes INTEGER NOT NULL,
          worked_seconds INTEGER NOT NULL,
          timestamp INTEGER NOT NULL
        );
        "#,
    ).map_err(|e| e.to_string())?;

    Ok(conn)
}


#[tauri::command]
fn set_config(app_handle: AppHandle, data: TimerSettings) -> Result<(), String> {
  let conn = initialize_database(&app_handle)?;
  conn.execute(
    "INSERT OR REPLACE INTO settings (id, pomodoro_minutes, pomodoro_seconds, short_break_minutes, short_break_seconds, long_break_minutes, long_break_seconds)
     VALUES (1, ?, ?, ?, ?, ?, ?)",
    params![
      data.pomodoro_time.minutes,
      data.pomodoro_time.seconds,
      data.short_break_time.minutes,
      data.short_break_time.seconds,
      data.long_break_time.minutes,
      data.long_break_time.seconds,
    ],
  ).map_err(|e| e.to_string())?;
  Ok(())
}

#[tauri::command]
async fn get_config(app_handle: AppHandle) -> Result<TimerSettings, String> {
  let conn = initialize_database(&app_handle)?;
  let mut stmt = conn.prepare(
    "SELECT pomodoro_minutes, pomodoro_seconds, short_break_minutes, short_break_seconds, long_break_minutes, long_break_seconds
     FROM settings WHERE id = 1"
  ).map_err(|e| e.to_string())?;
  stmt.query_row([], |row| {
    Ok(TimerSettings {
      pomodoro_time: TimerDuration { minutes: row.get(0)?, seconds: row.get(1)? },
      short_break_time: TimerDuration { minutes: row.get(2)?, seconds: row.get(3)? },
      long_break_time: TimerDuration { minutes: row.get(4)?, seconds: row.get(5)? },
    })
  }).map_err(|e| e.to_string())
}

#[tauri::command]
fn set_task(app_handle: AppHandle, data: Task) -> Result<(), String> {
  let conn = initialize_database(&app_handle)?;

  // 1) Upsert the task itself
  conn.execute(
    "INSERT OR REPLACE INTO tasks (id, task, expected_time, worked_minutes, worked_seconds)
     VALUES (?, ?, ?, ?, ?)",
    params![
      data.id,
      data.task,
      data.expected_time,
      data.worked_time.minutes,
      data.worked_time.seconds
    ],
  ).map_err(|e| e.to_string())?;

  // 2) Log to the audit table
  let now = chrono::Utc::now().timestamp(); // unix epoch seconds
  conn.execute(
    "INSERT INTO audit (task_id, worked_minutes, worked_seconds, timestamp)
     VALUES (?, ?, ?, ?)",
    params![
      data.id,
      data.worked_time.minutes,
      data.worked_time.seconds,
      now
    ],
  ).map_err(|e| e.to_string())?;

  Ok(())
}


#[tauri::command]
async fn get_tasks(app_handle: AppHandle) -> Result<Vec<Task>, String> {
  let conn = initialize_database(&app_handle)?;
  let mut stmt = conn.prepare(
    "SELECT id, task, expected_time, worked_minutes, worked_seconds FROM tasks"
  ).map_err(|e| e.to_string())?;
  let tasks = stmt.query_map([], |row| {
    Ok(Task {
      id: row.get(0)?,
      task: row.get(1)?,
      expected_time: row.get(2)?,
      worked_time: TimerDuration { minutes: row.get(3)?, seconds: row.get(4)? },
    })
  }).map_err(|e| e.to_string())?
    .collect::<Result<_, _>>().map_err(|e| e.to_string())?;
  Ok(tasks)
}

#[tauri::command]
fn delete_task(app_handle: AppHandle, id: String) -> Result<(), String> {
  let conn = initialize_database(&app_handle)?;
  conn.execute("DELETE FROM tasks WHERE id = ?", params![id]).map_err(|e| e.to_string())?;
  Ok(())
}

#[tauri::command]
async fn get_audit_for_period(
  app_handle: AppHandle,
  since_epoch: i64,
  until_epoch: i64
) -> Result<Vec<(String, TimerDuration, i64)>, String> {
  let conn = initialize_database(&app_handle)?;

  // Prepare the statement, mapping any rusqlite::Error -> String
  let mut stmt = conn
    .prepare(
      "SELECT task_id, worked_minutes, worked_seconds, timestamp
       FROM audit
       WHERE timestamp BETWEEN ? AND ?",
    )
    .map_err(|e| e.to_string())?;

  // Execute query_map, map Err -> String
  let rows_iter = stmt
    .query_map(params![since_epoch, until_epoch], |r| {
      Ok((
        r.get::<_, String>(0)?,
        TimerDuration { minutes: r.get(1)?, seconds: r.get(2)? },
        r.get::<_, i64>(3)?,
      ))
    })
    .map_err(|e| e.to_string())?;

  // Collect the iterator, mapping any row‐mapping error -> String
  let rows = rows_iter
    .collect::<Result<Vec<_>, rusqlite::Error>>()
    .map_err(|e| e.to_string())?;

  Ok(rows)
}



fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![ set_config, get_config, set_task, get_tasks, delete_task,get_audit_for_period ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}