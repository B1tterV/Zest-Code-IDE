use std::path::Path;
use tauri::{command, AppHandle};
use crate::modules::lsp::{self, TypeDefinition};

#[command]
pub async fn get_project_types(project_path: String) -> Result<Vec<TypeDefinition>, String> {
    Ok(lsp::get_local_types(&project_path))
}