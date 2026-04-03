use tauri::{command, AppHandle};
use crate::modules::file_system;
use std::path::Path;

#[command]
pub async fn open_project_picker(app: AppHandle) -> Result<Option<String>, String> {
    Ok(file_system::pick_folder(&app))
}

#[command]
pub async fn get_project_files(path: String) -> Result<Vec<file_system::FileNode>, String> {
    file_system::get_file_tree(std::path::Path::new(&path))
}

#[command]
pub async fn get_project_stack(path: String) -> Result<Vec<String>, String> {
    Ok(file_system::get_project_dependencies(Path::new(&path)))
}

#[command]
pub async fn read_file_content(path: String) -> Result<String, String> {
    file_system::read_file(path.as_str())
}

#[command]
pub async fn save_file_content(path: String, content: String) -> Result<(), String> {
    file_system::save_file(&path, &content)
}

#[command]
pub async fn create_new_file(path: String) -> Result<(), String> {
    file_system::create_file(&path)
}

#[command]
pub async fn create_new_directory(path: String) -> Result<(), String> {
    file_system::create_directory(&path)
}

#[command]
pub async fn delete_file_item(path: String) -> Result<(), String> {
    file_system::remove_item(&path)
}