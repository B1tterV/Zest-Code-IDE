use tauri::{command, AppHandle};
use crate::modules::file_system;
use std::path::Path;

#[command]
pub async fn open_project_picker(app: AppHandle) -> Result<Option<String>, String> {
    Ok(file_system::pick_folder(&app))
}

#[tauri::command]
pub async fn get_project_files(path: String) -> Result<Vec<file_system::FileNode>, String> {
    file_system::get_file_tree(std::path::Path::new(&path))
}

#[command]
pub async fn get_project_stack(path: String) -> Result<Vec<String>, String> {
    // Вызываем логику из модуля
    Ok(file_system::get_project_dependencies(Path::new(&path)))
}