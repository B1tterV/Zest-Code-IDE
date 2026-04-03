use tauri::command;
use crate::modules::search;

#[command]
pub async fn search_in_files(project_path: String, query: String) -> Result<Vec<search::SearchMatch>, String> {
    if query.is_empty() { return Ok(vec![]); }
    Ok(search::execute_global_search(&project_path, &query))
}