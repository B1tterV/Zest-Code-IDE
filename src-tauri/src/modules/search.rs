use std::fs::File;
use std::io::{BufRead, BufReader};
use std::path::Path;
use serde::Serialize;

#[derive(Serialize)]
pub struct SearchMatch {
    pub file_path: String,
    pub line_number: usize,
    pub line_content: String,
}

pub fn execute_global_search(project_path: &str, query: &str) -> Vec<SearchMatch> {
    let mut results = Vec::new();
    
    let walker = ignore::WalkBuilder::new(project_path)
        .hidden(false)
        .git_ignore(true)
        .build();

    for entry in walker.filter_map(|e| e.ok()) {
        let path = entry.path();
        
        if path.is_file() {
            if is_binary_file(path) { continue; }

            if let Ok(file) = File::open(path) {
                let reader = BufReader::new(file);
                for (idx, line) in reader.lines().enumerate() {
                    if let Ok(content) = line {
                        if content.contains(query) {
                            results.push(SearchMatch {
                                file_path: path.to_string_lossy().to_string(),
                                line_number: idx + 1,
                                line_content: content.trim().to_string(),
                            });
                        }
                    }
                    if results.len() >= 1000 { return results; }
                }
            }
        }
    }
    results
}

fn is_binary_file(path: &Path) -> bool {
    let ext = path.extension().and_then(|s| s.to_str()).unwrap_or("");
    matches!(ext, "png" | "jpg" | "jpeg" | "gif" | "exe" | "dll" | "so" | "node")
}