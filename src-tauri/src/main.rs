use serde::{Deserialize, Serialize};
use std::fs;
use tauri::{AppHandle};

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
    pub id: String, // Change type to String
    pub task: String,
    pub expected_time: u32,
    pub worked_time: TimerDuration,
}

#[tauri::command]
fn set_config(app_handle: AppHandle, data: TimerSettings) -> Result<(), String> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist.");

    fs::create_dir_all(&app_dir).map_err(|err| format!("Error creating directory: {}", err))?;

    let config_file_path = app_dir.join("config.json");
    let serialized_config =
        serde_json::to_string_pretty(&data).map_err(|err| format!("Error serializing config: {}", err))?;
    println!("I'm Sending Serialized config: {}", serialized_config);

    if let Err(err) = fs::write(&config_file_path, serialized_config) {
        return Err(format!("Error writing to config file: {}", err));
    }

    Ok(())
}

#[tauri::command]
async fn get_config(app_handle: AppHandle) -> Result<TimerSettings, String> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist.");

    let config_file_path = app_dir.join("config.json");
    let content = match fs::read_to_string(&config_file_path) {
        Ok(content) => content,
        Err(err) => return Err(format!("Error reading config file: {}", err)),
    };

    let config: TimerSettings = match serde_json::from_str(&content) {
        Ok(config) => config,
        Err(err) => return Err(format!("Error deserializing config: {}", err)),
    };

    Ok(config)
}

#[tauri::command]
fn set_task(app_handle: AppHandle, data: Task) -> Result<(), String> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist.");

    fs::create_dir_all(&app_dir)
        .map_err(|err| format!("Error creating directory: {}", err))?;

    let config_file_path = app_dir.join("tasks.json");

    let mut tasks: Vec<Task> = if let Ok(content) = fs::read_to_string(&config_file_path) {
        serde_json::from_str(&content).unwrap_or_else(|_| Vec::new())
    } else {
        Vec::new()
    };

    tasks.push(data);

    let serialized_tasks = serde_json::to_string_pretty(&tasks)
        .map_err(|err| format!("Error serializing tasks: {}", err))?;

    if let Err(err) = fs::write(&config_file_path, serialized_tasks) {
        return Err(format!("Error writing to task file: {}", err));
    }

    Ok(())
}

const DEFAULT_WORKED_TIME: TimerDuration = TimerDuration { minutes: 0, seconds: 0 };

#[tauri::command]
async fn get_tasks(app_handle: AppHandle) -> Result<Vec<Task>, String> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist.");

    let tasks_file_path = app_dir.join("tasks.json");
    let content = match fs::read_to_string(&tasks_file_path) {
        Ok(content) => content,
        Err(err) => return Err(format!("Error reading tasks file: {}", err)),
    };

    let mut tasks: Vec<Task> = match serde_json::from_str(&content) {
        Ok(tasks) => tasks,
        Err(err) => return Err(format!("Error deserializing tasks: {}", err)),
    };

    for task in &mut tasks {
        if task.worked_time.minutes >= 60 {
            task.worked_time = DEFAULT_WORKED_TIME;
        }
    }

    Ok(tasks)
}

#[tauri::command]
fn delete_task(app_handle: AppHandle, id: String) -> Result<(), String> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist.");

    let tasks_file_path = app_dir.join("tasks.json");
    let tasks_content = match fs::read_to_string(&tasks_file_path) {
        Ok(content) => content,
        Err(err) => return Err(format!("Error reading tasks file: {}", err)),
    };

    let mut tasks: Vec<Task> = match serde_json::from_str(&tasks_content) {
        Ok(tasks) => tasks,
        Err(err) => return Err(format!("Error deserializing tasks: {}", err)),
    };

    let index = tasks.iter().position(|task| task.id == id);
    if let Some(index) = index {
        tasks.remove(index);

        let serialized_tasks = serde_json::to_string_pretty(&tasks)
            .map_err(|err| format!("Error serializing tasks: {}", err))?;

        if let Err(err) = fs::write(&tasks_file_path, serialized_tasks) {
            return Err(format!("Error writing to tasks file: {}", err));
        }

        Ok(())
    } else {
        Err(format!("Task with ID {} not found", id))
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![set_config, get_config, set_task, get_tasks, delete_task])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
