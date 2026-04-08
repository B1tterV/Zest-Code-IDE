use ignore::gitignore::GitignoreBuilder;
use serde::Serialize;
use serde_json::Value;
use std::fs;
use std::path::Path;
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;

#[derive(Serialize)]
pub struct FileNode {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub is_ignored: bool,
    pub children: Option<Vec<FileNode>>,
}

pub fn get_file_tree(dir: &Path) -> Result<Vec<FileNode>, String> {
    let mut tree = Vec::new();

    let mut ignore_builder = GitignoreBuilder::new(dir);
    let gitignore_path = dir.join(".gitignore");

    if gitignore_path.exists() {
        ignore_builder.add(&gitignore_path);
    }
    let matcher = ignore_builder.build().map_err(|e| e.to_string())?;

    let entries = fs::read_dir(dir).map_err(|e: std::io::Error| e.to_string())?;

    for entry_result in entries {
        let entry = entry_result.map_err(|e: std::io::Error| e.to_string())?;
        let path = entry.path();

        let name = path
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string();

        if name == ".git" {
            continue;
        }

        let is_dir = path.is_dir();

        let relative_path = path.strip_prefix(dir).unwrap_or(&path);
        let check = matcher.matched(relative_path, is_dir);
        let is_ignored = check.is_ignore();

        tree.push(FileNode {
            name,
            path: path.to_string_lossy().to_string(),
            is_dir,
            is_ignored,
            children: None,
        });
    }

    // Сортировка: сначала папки, потом файлы
    tree.sort_by(|a, b| b.is_dir.cmp(&a.is_dir).then(a.name.cmp(&b.name)));
    Ok(tree)
}

pub fn get_project_dependencies(dir: &Path) -> Vec<String> {
    let pkg_json_path = dir.join("package.json");
    let mut deps = Vec::new();

    if let Ok(content) = fs::read_to_string(pkg_json_path) {
        if let Ok(json) = serde_json::from_str::<Value>(&content) {
            for section in ["dependencies", "devDependencies"] {
                if let Some(obj) = json.get(section).and_then(|v| v.as_object()) {
                    for key in obj.keys() {
                        deps.push(key.clone());
                    }
                }
            }
        }
    }
    deps
}

pub fn pick_folder(app: &AppHandle) -> Option<String> {
    app.dialog()
        .file()
        .blocking_pick_folder()
        .map(|path| path.to_string())
}

pub fn read_file(path: &str) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

pub fn save_file(path: &str, content: &str) -> Result<(), String> {
    std::fs::write(path, content).map_err(|e| e.to_string())
}

pub fn create_file(path: &str) -> Result<(), String> {
    fs::File::create(path).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn create_directory(path: &str) -> Result<(), String> {
    fs::create_dir_all(path).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn remove_item(path: &str) -> Result<(), String> {
    let path_buf = std::path::Path::new(path);
    if path_buf.is_dir() {
        fs::remove_dir_all(path).map_err(|e| e.to_string())
    } else {
        fs::remove_file(path).map_err(|e| e.to_string())
    }
}

pub fn rename_item(old_path: &str, new_path: &str) -> Result<(), String> {
    fs::rename(old_path, new_path).map_err(|e| e.to_string())
}

pub fn reveal_in_explorer(app: &tauri::AppHandle, path: &str) -> Result<(), String> {
    app.opener()
        .reveal_item_in_dir(Path::new(path))
        .map_err(|e: tauri_plugin_opener::Error| e.to_string())
}

pub fn copy_item(source: &str, destination: &str) -> Result<(), String> {
    let src = Path::new(source);
    let dst = Path::new(destination);

    if src.is_dir() {
        copy_dir_recursive(src, dst).map_err(|e| e.to_string())
    } else {
        fs::copy(src, dst).map_err(|e| e.to_string()).map(|_| ())
    }
}

fn copy_dir_recursive(src: &Path, dst: &Path) -> std::io::Result<()> {
    fs::create_dir_all(dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        if ty.is_dir() {
            copy_dir_recursive(&entry.path(), &dst.join(entry.file_name()))?;
        } else {
            fs::copy(entry.path(), dst.join(entry.file_name()))?;
        }
    }
    Ok(())
}
