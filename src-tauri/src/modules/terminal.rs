use portable_pty::{native_pty_system, Child, CommandBuilder, MasterPty, PtySize}; // Добавили MasterPty
use std::{
    io::{Read, Write},
    sync::{Arc, Mutex},
    thread,
};
use tauri::{AppHandle, Emitter};

pub struct TerminalInstance {
    pub master: Box<dyn MasterPty + Send>,
    pub writer: Box<dyn Write + Send>,
    pub child: Box<dyn Child + Send + Sync>,
}

pub struct TerminalState(pub Arc<Mutex<std::collections::HashMap<String, TerminalInstance>>>);

pub fn spawn_terminal(
    app: AppHandle,
    id: String,
    cols: u16,
    rows: u16,
    state: &TerminalState,
) -> Result<(), String> {
    let pty_system = native_pty_system();

    let pty_pair = pty_system
        .openpty(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|e| e.to_string())?;

    #[cfg(target_os = "windows")]
    let shell = "powershell.exe";
    #[cfg(not(target_os = "windows"))]
    let shell = "sh";

    let mut cmd = CommandBuilder::new(shell);
    #[cfg(target_os = "windows")]
    cmd.args(["-NoLogo", "-NoExit", "-Command", "$OutputEncoding = [System.Text.Encoding]::UTF8; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;"]);

    cmd.env("PYTHONIOENCODING", "UTF-8");
    cmd.env("TERM", "xterm-256color");
    cmd.env("LANG", "en_US.UTF-8");

    if let Ok(cwd) = std::env::current_dir() {
        cmd.cwd(cwd);
    }

    let child = pty_pair
        .slave
        .spawn_command(cmd)
        .map_err(|e| e.to_string())?;

    let mut reader = pty_pair
        .master
        .try_clone_reader()
        .map_err(|e| e.to_string())?;
    let writer = pty_pair.master.take_writer().map_err(|e| e.to_string())?;

    // ТЕПЕРЬ МЫ СОХРАНЯЕМ pty_pair.master В СТОРОНЕ
    state.0.lock().unwrap().insert(
        id.clone(),
        TerminalInstance {
            master: pty_pair.master, // Это не даст каналу закрыться
            writer,
            child,
        },
    );

    let id_for_thread = id.clone();
    thread::spawn(move || {
        let mut buffer = [0u8; 8192];
        while let Ok(n) = reader.read(&mut buffer) {
            if n == 0 {
                break;
            }
            let data = String::from_utf8_lossy(&buffer[..n]).to_string();
            let _ = app.emit(&format!("terminal-data-{}", id_for_thread), data);
        }
        println!(
            "PTY Process for {} CLOSED (Reader loop ended)",
            id_for_thread
        );
    });

    Ok(())
}

pub fn write_to_terminal(id: &str, data: &str, state: &TerminalState) -> Result<(), String> {
    let mut lock = state.0.lock().unwrap();
    if let Some(instance) = lock.get_mut(id) {
        instance
            .writer
            .write_all(data.as_bytes())
            .map_err(|e: std::io::Error| e.to_string())?;
        instance
            .writer
            .flush()
            .map_err(|e: std::io::Error| e.to_string())?;
    }
    Ok(())
}

pub fn resize_terminal(
    id: &str,
    cols: u16,
    rows: u16,
    state: &TerminalState,
) -> Result<(), String> {
    let mut lock = state.0.lock().unwrap();
    if let Some(instance) = lock.get_mut(id) {
        instance
            .master
            .resize(PtySize {
                rows,
                cols,
                pixel_width: 0,
                pixel_height: 0,
            })
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}
