use tauri::{command, AppHandle};
use crate::modules::file_system;

#[command]
pub async fn open_project_picker(app: AppHandle) -> Result<Option<String>, String> {
    Ok(file_system::pick_folder(&app))
}