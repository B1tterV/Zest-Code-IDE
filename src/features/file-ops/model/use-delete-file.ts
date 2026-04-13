import { invoke } from "@tauri-apps/api/core";
import { ask } from "@tauri-apps/plugin-dialog";
import { useFileStore } from "@/entities/file";
import { useEditorStore } from "@/entities/editor";

export const useDeleteFile = () => {
  const removeNode = useFileStore((s) => s.removeNode);
  const closeTab = useEditorStore((s) => s.closeTab);

  const deleteItem = async (path: string, name: string) => {
    const confirmed = await ask(`Are you sure you want to delete '${name}'?`, {
      title: "Zest Code",
      kind: "warning",
    });

    if (confirmed) {
      try {
        await invoke("delete_file_item", { path });
        closeTab(path);

        removeNode(path);
      } catch (e) {
        console.error("Delete failed:", e);
      }
    }
  };

  return { deleteItem };
};
