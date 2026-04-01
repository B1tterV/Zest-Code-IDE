use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;

pub fn pick_folder(app: &AppHandle) -> Option<String> {
    app.dialog()
        .file()
        .blocking_pick_folder()
        .map(|path| path.to_string())
}