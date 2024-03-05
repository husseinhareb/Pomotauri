// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod config;
use config::TimeConfig;
use serde::{Deserialize, Serialize};
use std::fs;
use tauri::AppHandle;



#[derive(Debug, Deserialize, Serialize)]
struct TimerSettings {
    pomodoro_time: TimerDuration,
    short_break_time: TimerDuration,
    long_break_time: TimerDuration,
}

#[derive(Debug, Deserialize, Serialize)]
struct TimerDuration {
    minutes: u32,
    seconds: u32,
}

#[tauri::command]
async fn receive_data(_app_handle: AppHandle, data: TimerSettings) {
    println!("Received timer settings: {:?}", data);
    // Save the received settings
    if let Err(err) = save_settings(&data) {
        eprintln!("Error saving settings: {}", err);
    }
}


#[tauri::command]
fn set_config(app_handle: AppHandle, config: TimeConfig) -> TimeConfig {
    let app_dir = app_handle.path_resolver().app_data_dir().expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let config_file_path = app_dir.join("config.json");

    let serialized_config = serde_json::to_string_pretty(&config).unwrap();
    fs::write(config_file_path, serialized_config).expect("Unable to write to config file");
    config
}


fn save_settings(settings: &TimerSettings) -> std::io::Result<()> {
    let json = serde_json::to_string(settings)?;
    fs::write("settings.json", json)?;
    Ok(())
}

fn load_settings() -> std::io::Result<TimerSettings> {
    let json = fs::read_to_string("settings.json")?;
    let settings: TimerSettings = serde_json::from_str(&json)?;
    Ok(settings)
}

fn main() {
    // Load existing settings or  defaults if the file doesn't exist
    let mut settings = match load_settings() {
        Ok(settings) => settings,
        Err(_) => TimerSettings {
            pomodoro_time: TimerDuration {
                minutes: 25,
                seconds: 0,
            },
            short_break_time: TimerDuration {
                minutes: 5,
                seconds: 0,
            },
            long_break_time: TimerDuration {
                minutes: 15,
                seconds: 0,
            },
        },
    };

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![receive_data, set_config])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}



