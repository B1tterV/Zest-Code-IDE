use crate::modules::terminal;
use tauri::Emitter;
use tauri::{command, AppHandle, State};

#[command]
pub async fn create_terminal(
    app: AppHandle,
    id: String,
    cols: u16,
    rows: u16,
    state: State<'_, terminal::TerminalState>,
) -> Result<(), String> {
    terminal::spawn_terminal(app, id, cols, rows, &state)
}

#[command]
pub async fn write_terminal(
    id: String,
    data: String,
    state: State<'_, terminal::TerminalState>,
) -> Result<(), String> {
    terminal::write_to_terminal(&id, &data, &state)
}

#[command]
pub async fn resize_terminal(
    id: String,
    cols: u16,
    rows: u16,
    state: State<'_, terminal::TerminalState>,
) -> Result<(), String> {
    terminal::resize_terminal(&id, cols, rows, &state)
}
