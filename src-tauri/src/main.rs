#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri::Manager;

#[derive(Debug, Deserialize, Serialize)]
pub struct TimerDuration {
    pub minutes: u32,
    pub seconds: u32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TimerSettings {
    pub pomodoro_time: TimerDuration,
    pub short_break_time: TimerDuration,
    pub long_break_time: TimerDuration,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Task {
    pub id: String,
    pub task: String,
    pub expected_time: u32,
    pub worked_time: TimerDuration,
}

fn initialize_database(app_handle: &AppHandle) -> Result<Connection, String> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|err| format!("Error getting app data directory: {}", err))?;

    std::fs::create_dir_all(&app_dir).map_err(|err| format!("Error creating directory: {}", err))?;
    let db_path = app_dir.join("data.db");

    let conn = Connection::open(db_path).map_err(|err| format!("Error opening database: {}", err))?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pomodoro_minutes INTEGER NOT NULL,
            pomodoro_seconds INTEGER NOT NULL,
            short_break_minutes INTEGER NOT NULL,
            short_break_seconds INTEGER NOT NULL,
            long_break_minutes INTEGER NOT NULL,
            long_break_seconds INTEGER NOT NULL
        )",
        [],
    )
    .map_err(|err| format!("Error creating settings table: {}", err))?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            task TEXT NOT NULL,
            expected_time INTEGER NOT NULL,
            worked_minutes INTEGER NOT NULL,
            worked_seconds INTEGER NOT NULL
        )",
        [],
    )
    .map_err(|err| format!("Error creating tasks table: {}", err))?;

    Ok(conn)
}


#[tauri::command]
fn set_config(app_handle: AppHandle, data: TimerSettings) -> Result<(), String> {
    let conn = initialize_database(&app_handle)?;

    conn.execute(
        "INSERT OR REPLACE INTO settings (
            id, pomodoro_minutes, pomodoro_seconds, short_break_minutes, short_break_seconds, long_break_minutes, long_break_seconds
        ) VALUES (1, ?, ?, ?, ?, ?, ?)",
        params![
            data.pomodoro_time.minutes,
            data.pomodoro_time.seconds,
            data.short_break_time.minutes,
            data.short_break_time.seconds,
            data.long_break_time.minutes,
            data.long_break_time.seconds
        ],
    )
    .map_err(|err| format!("Error inserting/updating settings: {}", err))?;

    Ok(())
}

#[tauri::command]
async fn get_config(app_handle: AppHandle) -> Result<TimerSettings, String> {
    let conn = initialize_database(&app_handle)?;

    let mut stmt = conn
        .prepare("SELECT pomodoro_minutes, pomodoro_seconds, short_break_minutes, short_break_seconds, long_break_minutes, long_break_seconds FROM settings WHERE id = 1")
        .map_err(|err| format!("Error preparing statement: {}", err))?;

    let row = stmt.query_row([], |row| {
        Ok(TimerSettings {
            pomodoro_time: TimerDuration {
                minutes: row.get(0)?,
                seconds: row.get(1)?,
            },
            short_break_time: TimerDuration {
                minutes: row.get(2)?,
                seconds: row.get(3)?,
            },
            long_break_time: TimerDuration {
                minutes: row.get(4)?,
                seconds: row.get(5)?,
            },
        })
    });

    row.map_err(|err| format!("Error retrieving settings: {}", err))
}

#[tauri::command]
fn set_task(app_handle: AppHandle, data: Task) -> Result<(), String> {
    let conn = initialize_database(&app_handle)?;

    conn.execute(
        "INSERT INTO tasks (id, task, expected_time, worked_minutes, worked_seconds) VALUES (?, ?, ?, ?, ?)",
        params![
            data.id,
            data.task,
            data.expected_time,
            data.worked_time.minutes,
            data.worked_time.seconds
        ],
    )
    .map_err(|err| format!("Error inserting task: {}", err))?;

    Ok(())
}

#[tauri::command]
async fn get_tasks(app_handle: AppHandle) -> Result<Vec<Task>, String> {
    let conn = initialize_database(&app_handle)?;

    let mut stmt = conn
        .prepare("SELECT id, task, expected_time, worked_minutes, worked_seconds FROM tasks")
        .map_err(|err| format!("Error preparing statement: {}", err))?;

    let tasks = stmt
        .query_map([], |row| {
            Ok(Task {
                id: row.get(0)?,
                task: row.get(1)?,
                expected_time: row.get(2)?,
                worked_time: TimerDuration {
                    minutes: row.get(3)?,
                    seconds: row.get(4)?,
                },
            })
        })
        .map_err(|err| format!("Error querying tasks: {}", err))?
        .collect::<Result<Vec<Task>, _>>()
        .map_err(|err| format!("Error collecting tasks: {}", err))?;

    Ok(tasks)
}

#[tauri::command]
fn delete_task(app_handle: AppHandle, id: String) -> Result<(), String> {
    let conn = initialize_database(&app_handle)?;

    conn.execute("DELETE FROM tasks WHERE id = ?", params![id])
        .map_err(|err| format!("Error deleting task: {}", err))?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            set_config,
            get_config,
            set_task,
            get_tasks,
            delete_task
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
