mod core;
mod commands;
mod modules;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            core::setup::init(app)?;
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
           commands::project::open_project_picker,
           commands::project::get_project_files,
           commands::project::get_project_stack,
           commands::project::read_file_content,
           commands::project::save_file_content,
           commands::project::create_new_file,
           commands::project::create_new_directory,
           commands::project::delete_file_item
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
