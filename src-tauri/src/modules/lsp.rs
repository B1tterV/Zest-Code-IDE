use std::fs;
use std::path::Path;
use serde::Serialize;
use ignore::WalkBuilder;

#[derive(Serialize)]
pub struct TypeDefinition {
    pub path: String,
    pub content: String,
}

pub fn get_local_types(project_path: &str) -> Vec<TypeDefinition> {
    let mut types = Vec::new();
    let nm_path = Path::new(project_path).join("node_modules");
    
    if !nm_path.exists() { return types; }

    let walker = WalkBuilder::new(nm_path)
        .standard_filters(true)
        .hidden(false)
        .build();

    for entry in walker.filter_map(|e| e.ok()) {
        let path = entry.path();
        if path.is_file() && path.to_string_lossy().ends_with(".d.ts") {
            if let Ok(content) = fs::read_to_string(path) {
                let relative_path = path.to_string_lossy()
                    .split("node_modules")
                    .last()
                    .unwrap_or("")
                    .to_string();

                types.push(TypeDefinition {
                    path: format!("file:///node_modules{}", relative_path.replace("\\", "/")),
                    content,
                });
            }
        }
        if types.len() > 5000 { break; }
    }
    types
}

// Заглушка для будущего LSP
pub fn spawn_lsp(command: &str) -> std::process::Child {
    std::process::Command::new(command)
        .stdin(std::process::Stdio::piped())
        .stdout(std::process::Stdio::piped())
        .spawn()
        .expect("Failed to start LSP")
}