use tauri::App;

pub fn init(_app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    #[cfg(target_os = "windows")]
    {
        let args = "--force-color-profile=srgb --disable-features=DynamicColor,HDR";
        std::env::set_var("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", args);
    }
    Ok(())
}