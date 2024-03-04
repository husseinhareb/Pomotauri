// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use tauri::AppHandle;

// Your existing code for TimerSettings and TimerDuration goes here...

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
    // Load existing settings or use defaults if the file doesn't exist
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
        .invoke_handler(tauri::generate_handler![receive_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}




