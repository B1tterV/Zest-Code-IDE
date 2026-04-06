mod commands;
mod core;
mod modules;

use std::sync::{Arc, Mutex};
use std::collections::HashMap;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            core::setup::init(app)?;
            Ok(())
        })
        .manage(modules::terminal::TerminalState(Arc::new(Mutex::new(HashMap::new()))))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::project::open_project_picker,
            commands::project::get_project_files,
            commands::project::get_project_stack,
            commands::project::read_file_content,
            commands::project::save_file_content,
            commands::project::create_new_file,
            commands::project::create_new_directory,
            commands::project::delete_file_item,
            commands::project::rename_file_item,
            commands::project::reveal_item_in_explorer,
            commands::project::copy_file_item,
            commands::search::search_in_files,
            commands::lsp::get_project_types,
            commands::terminal::create_terminal,
            commands::terminal::write_terminal,
            commands::terminal::resize_terminal
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
