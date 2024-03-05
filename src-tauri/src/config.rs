use serde::{Deserialize, Serialize};
use std::fs;

#[derive(Debug, Serialize, Deserialize)]
pub struct TimeConfig {
    minutes: u32,
    seconds: u32,
}

impl TimeConfig {
    pub fn new(minutes: u32, seconds: u32) -> Self {
        TimeConfig { minutes, seconds }
    }

    pub fn from_file(file_path: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let content = fs::read_to_string(file_path)?;
        let config: TimeConfig = serde_json::from_str(&content)?;
        Ok(config)
    }
}
