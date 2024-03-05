// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use tauri::{AppHandle};

#[derive(Debug, Deserialize, Serialize)]
pub struct TimerSettings {
    pub pomodoro_time: TimerDuration,
    pub short_break_time: TimerDuration,
    pub long_break_time: TimerDuration,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TimerDuration {
    pub minutes: u32,
    pub seconds: u32,
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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![set_config, get_config])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}